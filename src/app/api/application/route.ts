import { getCloudflareContext } from '@opennextjs/cloudflare';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { cvError, MAX_APPLICATION_BYTES, readApplicationFields } from '@/lib/application';
import { logApplicationFailure, saveNotionApplication } from '@/lib/notion-application';

type ApplicationEnv = {
  NOTION_APPLICATION_TOKEN?: string;
  NOTION_APPLICATION_DATA_SOURCE_ID?: string;
  APPLICATION_RATE_LIMITER?: { limit(input: { key: string }): Promise<{ success: boolean }> };
};

const pendingSubmissions = new Set<string>();

function failure(error: string, status: number) {
  return NextResponse.json({ error }, { status });
}

export async function POST(request: Request) {
  let env: ApplicationEnv = {};
  try {
    env = getCloudflareContext().env as ApplicationEnv;
  } catch {
    if (process.env.NODE_ENV === 'production') return failure('error', 503);
  }

  const token = env.NOTION_APPLICATION_TOKEN || process.env.NOTION_APPLICATION_TOKEN;
  const dataSourceId = env.NOTION_APPLICATION_DATA_SOURCE_ID || process.env.NOTION_APPLICATION_DATA_SOURCE_ID;
  if (!token || !dataSourceId || (process.env.NODE_ENV === 'production' && !env.APPLICATION_RATE_LIMITER)) {
    console.error('Application endpoint is missing configuration');
    return failure('error', 503);
  }

  try {
    if (env.APPLICATION_RATE_LIMITER) {
      const key = request.headers.get('CF-Connecting-IP') || 'unknown';
      const { success } = await env.APPLICATION_RATE_LIMITER.limit({ key });
      if (!success) return failure('rateLimited', 429);
    }
  } catch {
    console.error('Application rate limiter failed');
    return failure('error', 503);
  }

  const contentType = request.headers.get('content-type');
  if (!request.body || !contentType?.toLowerCase().startsWith('multipart/form-data;')) {
    return failure('invalidFields', 400);
  }
  if (Number(request.headers.get('content-length')) > MAX_APPLICATION_BYTES) return failure('cvTooLarge', 413);

  let form: FormData;
  let size = 0;
  try {
    const body = request.body.pipeThrough(new TransformStream<Uint8Array, Uint8Array>({
      transform(chunk, controller) {
        size += chunk.byteLength;
        if (size > MAX_APPLICATION_BYTES) controller.error(new Error('Application exceeds size limit'));
        else controller.enqueue(chunk);
      },
    }));
    form = await new Response(body, { headers: { 'content-type': contentType } }).formData();
  } catch {
    return size > MAX_APPLICATION_BYTES ? failure('cvTooLarge', 413) : failure('invalidFields', 400);
  }

  const application = readApplicationFields(form);
  const submissionId = z.uuid().safeParse(form.get('submissionId'));
  if (!application.success || !submissionId.success) return failure('invalidFields', 400);

  const attachments = form.getAll('cv');
  const cv = attachments[0] ?? null;
  const fileError = cvError(cv);
  if (fileError) return failure(fileError, fileError === 'cvTooLarge' ? 413 : 400);
  if (!(cv instanceof File) || attachments.length !== 1) return failure('cvInvalid', 400);
  const prefix = await cv.slice(0, 8).text();
  const suffix = await cv.slice(-1024).text();
  if (!/^%PDF-\d\.\d/.test(prefix) || !/%%EOF\s*$/.test(suffix)) return failure('cvInvalid', 400);

  if (pendingSubmissions.has(submissionId.data)) return failure('inProgress', 409);
  pendingSubmissions.add(submissionId.data);
  try {
    await saveNotionApplication({ token, dataSourceId }, application.data, cv, submissionId.data);
    return NextResponse.json({ success: true });
  } catch (error) {
    logApplicationFailure(error);
    return failure('error', 503);
  } finally {
    pendingSubmissions.delete(submissionId.data);
  }
}
