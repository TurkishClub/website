function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage)
  }
  return v
}

export const apiVersion =
  process.env.SANITY_STUDIO_API_VERSION || '2025-07-06'

export const projectId = assertValue(
  process.env.SANITY_STUDIO_PROJECT_ID,
  'Missing environment variable: SANITY_STUDIO_PROJECT_ID'
)

export const dataset = assertValue(
  process.env.SANITY_STUDIO_DATASET,
  'Missing environment variable: SANITY_STUDIO_DATASET'
)

export const studioUrl = assertValue(
  process.env.SANITY_STUDIO_URL,
  'Missing environment variable: SANITY_STUDIO_URL'
)

export const previewOrigin = assertValue(
  process.env.SANITY_STUDIO_PREVIEW_ORIGIN,
  'Missing environment variable: SANITY_STUDIO_PREVIEW_ORIGIN'
)

export const viewerToken = assertValue(
  process.env.SANITY_STUDIO_VIEWER_TOKEN,
  'Missing environment variable: SANITY_STUDIO_VIEWER_TOKEN'
)