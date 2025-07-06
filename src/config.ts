export const port = process.env.PORT || 3000;
export const host = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : `http://localhost:${port}`;

// The base path for the application, used for routing and links.
// sets the base url and port depending on the environment