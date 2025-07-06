# Rolling Out Updates

## To Deploy Updates

1. **Commit and push your changes to the main branch** (or the branch Vercel is configured to deploy).
2. **Vercel will automatically build and deploy your changes.**
3. **Check the deployment status** in the Vercel dashboard.

## Manual Redeploy

- If needed, you can trigger a redeploy from the Vercel dashboard.

## Cloudflare

- For Cloudflare, use:
  ```sh
  npm run deploy
  ```
  This will build and deploy using the `opennextjs-cloudflare` scripts.