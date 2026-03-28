# Turkish Club Website Documentation

Welcome! This is the repository for TurkischClub-Munich website.

## Update in node dependency

We have updated the dependency versions. If you face any version trouble best form is to rebuild using steps bellow .
    delete node_modules folder
    delete package-lock.json
    run npm cache verify
    run npm install

## Cloudflare Worker Size Limit

We have a size limit of 3MB for our Cloudflare Worker, which is verified by the gzipped size of the worker. To check the size of the worker, run the following command: `wrangler deploy --dry-run`. To prevent the worker from exceeding the size limit, we should avoid adding large dependencies to the project and determine if the dependency is a dev dependency or a production dependency. If it is a dev dependency, we should move it to the devDependencies section of the package.json file, as that will not be included in the production build. Additionally, if the dependency added has large transitive dependencies that are not needed for the production build, we should exclude them from the production build by using the `outputFileTracingExcludes` option in the `next.config.js` file.

## Blog comments setup

The blog comments feature uses DigitalOcean Managed PostgreSQL.

1. Add env values in `.env`:
    - `DATABASE_URL` for pooled runtime connection.
    - `DATABASE_URL_DIRECT` for migrations.
    - `NEXT_PUBLIC_TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY` for captcha.
    - `COMMENTS_REQUIRE_TURNSTILE=true` in production.
2. Run migration:
    - `npm run migrate:comments`
3. Start app:
    - `npm run dev`

The comments API endpoints are:

- `GET /api/comments?postSlug=<slug>&locale=<locale>`
- `POST /api/comments`
