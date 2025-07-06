import { client } from '@/sanity/lib/client'
import { validatePreviewUrl } from '@sanity/preview-url-secret'
import { draftMode } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

// Configure the client with a read token for preview URL validation
type ClientWithToken = typeof client & { withConfig: (config: any) => any }
const clientWithToken = (client as ClientWithToken).withConfig({
  token: process.env.SANITY_STUDIO_VIEWER_TOKEN,
})

export async function GET(request: NextRequest) {
  const { isValid, redirectTo = '/' } = await validatePreviewUrl(
    clientWithToken,
    request.url
  )
  if (!isValid) {
    return new Response('Invalid secret', { status: 401 })
  }

  const draft = await draftMode()
  draft.enable()

  return NextResponse.redirect(new URL(redirectTo, request.url))
}
