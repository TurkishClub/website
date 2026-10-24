# Turkish Club Website Documentation

Welcome! This is the repository for TurkischClub-Munich website.

## Upcoming event countdown

The homepage displays the earliest upcoming published **Event** in Sanity. To add
an event, enter its Name, Embed URL, Time, and Location in Sanity Studio. Use the
Luma iframe URL (`https://luma.com/embed/event/evt-.../simple`) for Embed URL, and
include the correct timezone when setting Time. Publish after reviewing it locally.

For a local preview before publishing, install dependencies with `npm install` and
create an ignored `.env.local` with your `SANITY_STUDIO_PROJECT_ID`,
`SANITY_STUDIO_DATASET`, and `SANITY_STUDIO_URL` settings. Add a single-line JSON
value containing the event details:

```dotenv
LOCAL_EVENT_PREVIEW_JSON='{"_id":"local-preview","name":"Event title","embedUrl":"https://luma.com/embed/event/evt-.../simple","time":"2026-10-29T19:00:00+01:00","location":"Event location"}'
```

Run `npm run dev` and open `http://localhost:3000/en#upcoming-event`. This override only applies
in development; production continues to read published events from Sanity. Remove
`LOCAL_EVENT_PREVIEW_JSON` and restart the dev server to check the published event.

# Update in node dependency

We have updated the dependency versions. If you face any version trouble best form is to rebuild using steps bellow . 
    delete node_modules folder
    delete package-lock.json
    run npm cache verify
    run npm install

# Cloudflare Worker Size Limit

We have a size limit of 3MB for our Cloudflare Worker, which is verified by the gzipped size of the worker. To check the size of the worker, run the following command: `wrangler deploy --dry-run`. To prevent the worker from exceeding the size limit, we should avoid adding large dependencies to the project and determine if the dependency is a dev dependency or a production dependency. If it is a dev dependency, we should move it to the devDependencies section of the package.json file, as that will not be included in the production build. Additionally, if the dependency added has large transitive dependencies that are not needed for the production build, we should exclude them from the production build by using the `outputFileTracingExcludes` option in the `next.config.js` file.
