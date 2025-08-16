/**
* This configuration file lets you run `$ sanity [command]` in this folder
* Go to https://www.sanity.io/docs/cli to learn more.
**/
import { defineCliConfig } from 'sanity/cli'

const projectId = "qu5tnjcm"
const dataset = "production"
const projectId = process.env.SANITY_PROJECT_ID
const dataset = process.env.SANITY_DATASET

if (!projectId || !dataset) {
  throw new Error("Missing required environment variables: SANITY_PROJECT_ID and/or SANITY_DATASET")
}
export default defineCliConfig({ api: { projectId, dataset } })
