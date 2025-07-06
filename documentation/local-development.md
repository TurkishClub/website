# Local Development

## Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)

## Setup

1. **Install dependencies:**
   ```sh
   npm install
   ```

2. **Run the development server:**
   ```sh
   npm run dev
   ```
   By default, the site runs at [http://localhost:3000](http://localhost:3000).

3. **Open the site in your browser:**
   ```
   http://localhost:3000
   ```

## Notes

- Environment variables may be required for Sanity or other integrations. See `.env.example` if present.
- For testing, use:
  ```sh
  npm test
  ```
  or
  ```sh
  npx playwright test
  ```