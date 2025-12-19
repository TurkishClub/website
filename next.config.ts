import { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin({
  experimental: {
    createMessagesDeclaration: './messages/en.json'
  }
});

const config: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        port: '',
        pathname: '/images/**'
      },
      {
        protocol: 'https',
        hostname: 'www.sueddeutsche.de',
        port: '',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        port: '',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**'
      }
    ]
  },
  async rewrites() {
    return {
      beforeFiles: [
        // PostHog rewrites must come before the i18n rewrites
        {
          source: '/ingest/static/:path*',
          destination: 'https://eu-assets.i.posthog.com/static/:path*'
        },
        {
          source: '/ingest/:path*',
          destination: 'https://eu.i.posthog.com/:path*'
        }
      ]
    };
  },
  outputFileTracingExcludes: {
    '*': [
      "node_modules/@vercel/og/**/*",
      "node_modules/@sanity/vision/**/*",
      "node_modules/@sanity/code-input/**/*",
      "node_modules/@sanity/ui/**/*",
      "node_modules/styled-components/**/*",
      "node_modules/sharp/**/*",
      "node_modules/@opentelemetry/api/**/*",
      "node_modules/next/dist/compiled/@opentelemetry/**/*",
      "node_modules/typescript/**/*",
      "node_modules/@swc/**/*",
      "node_modules/esbuild/**/*",
      "node_modules/webpack/**/*",
      "node_modules/@next/swc-*/**/*",
      "node_modules/terser/**/*",
      "node_modules/@biomejs/**/*",           // 50.61 MB - linting tool
      "node_modules/@esbuild/**/*",           // 10.03 MB - bundler
      "node_modules/prettier/**/*",           // 8.18 MB - formatter
      "node_modules/playwright-core/**/*",    // 7.91 MB - testing
      "node_modules/playwright/**/*",         // 3.71 MB - testing
      "node_modules/eslint/**/*",             // 2.82 MB - linting
      "node_modules/@typescript-eslint/**/*", // 3.5 MB - linting
      // "node_modules/vite/**/*",               // 2.13 MB - dev server
      // "node_modules/vitest/**/*",             // 1.32 MB - testing
      // "node_modules/@testing-library/**/*",   // 2.64 MB - testing
      // "node_modules/@jest/**/*",              // testing
      // "node_modules/webpack-bundle-analyzer/**/*", // 1.44 MB
      "node_modules/leaflet/**/*",
      "node_modules/react-leaflet/**/*",
      "node_modules/@react-leaflet/**/*",
      "node_modules/canvas/**/*",
      "node_modules/jsdom/**/*",
    ],
  },
  skipTrailingSlashRedirect: true,
};

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

export default withBundleAnalyzer(withNextIntl(config));
