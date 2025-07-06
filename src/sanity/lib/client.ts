import { createClient } from 'next-sanity'
import { projectId, dataset, apiVersion, studioUrl } from '../env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  stega: { studioUrl },
})
