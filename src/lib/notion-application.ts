import { applicationTeams, type Application } from './application';

type NotionConfig = { token: string; dataSourceId: string };

class NotionRequestError extends Error {
  constructor(readonly operation: string, readonly status: number) {
    super(`Notion ${operation} failed (${status})`);
  }
}

export function logApplicationFailure(error: unknown) {
  if (error instanceof NotionRequestError) {
    console.error('Application storage failed', { operation: error.operation, status: error.status });
  } else {
    console.error('Application storage failed');
  }
}

async function notionPost<T>(config: NotionConfig, operation: string, path: string, body: object) {
  const multipart = body instanceof FormData;
  const response = await fetch(`https://api.notion.com/v1/${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.token}`,
      'Notion-Version': '2026-03-11',
      ...(!multipart && { 'Content-Type': 'application/json' }),
    },
    body: multipart ? body : JSON.stringify(body),
    signal: AbortSignal.timeout(15_000),
  });
  if (!response.ok) throw new NotionRequestError(operation, response.status);
  return (await response.json()) as T;
}

const richText = (content: string) => [{ type: 'text', text: { content } }];

export async function saveNotionApplication(config: NotionConfig, application: Application, cv: File, submissionId: string) {
  const existing = await notionPost<{ results: { id: string }[] }>(
    config, 'lookup', `data_sources/${config.dataSourceId}/query`,
    { page_size: 1, filter: { property: 'Website submission ID', rich_text: { equals: submissionId } } }
  );
  if (existing.results.length) return;

  const uploaded = await notionPost<{ id: string }>(config, 'create upload', 'file_uploads', {
    mode: 'single_part', filename: 'CV.pdf', content_type: 'application/pdf',
  });
  const file = new FormData();
  file.set('file', cv.slice(0, cv.size, 'application/pdf'), 'CV.pdf');
  const transfer = await notionPost<{ status: string }>(config, 'send upload', `file_uploads/${uploaded.id}/send`, file);
  if (transfer.status !== 'uploaded') throw new Error('Notion did not complete the CV upload');

  const answers = [
    ['Okul', application.university],
    ['Derece', application.degree],
    ['Bölüm', application.program],
    ['Dönem', application.semester],
    ...(application.teams.includes('other') ? [['Diğer ekip', application.otherTeam]] : []),
    ['İstediğin takıma katıldığın takdirde ne yapmak isterdin?', application.contribution],
    ['Neden Turkish Club’a katılmak istiyorsun ve beklentilerin neler?', application.motivation],
  ];
  const page = await notionPost<{ id: string }>(config, 'create page', 'pages', {
    parent: { type: 'data_source_id', data_source_id: config.dataSourceId },
    properties: {
      Applicant: { title: richText(application.name) },
      Email: { email: application.email },
      'Submitted at': { date: { start: new Date().toISOString() } },
      'Preferred teams': { multi_select: [...new Set(application.teams)].map((team) => ({ name: applicationTeams[team] })) },
      'Weekly availability': { rich_text: richText(application.availability) },
      'Website submission ID': { rich_text: richText(submissionId) },
      Status: { status: { name: 'New' } },
    },
    children: [
      ...answers.flatMap(([label, value]) => [
        { type: 'heading_3', heading_3: { rich_text: richText(label) } },
        { type: 'paragraph', paragraph: { rich_text: richText(value) } },
      ]),
      { type: 'file', file: { type: 'file_upload', file_upload: { id: uploaded.id } } },
    ],
  });
  if (!page.id) throw new Error('Notion did not confirm the application page');
}
