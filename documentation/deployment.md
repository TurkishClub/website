
# Deployment to Vercel

## Steps

1. **Push your code to GitHub (or another git provider).**
2. **Go to [Vercel](https://vercel.com/) and import your repository.**(TODO, we need to configure it to our case)
3. **Configure environment variables** as needed in the Vercel dashboard.
4. **Vercel will automatically detect Next.js and deploy your site.**

## Custom Domains

- You can add custom domains in the Vercel dashboard.

## Cloudflare

- The project also supports Cloudflare deployment via `@opennextjs/cloudflare` and `wrangler`.
- See [`package.json`](../package.json) scripts for Cloudflare commands.