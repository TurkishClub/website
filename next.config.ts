import {NextConfig} from 'next';
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
  // This is required to support PostHog trailing slash API requests
  skipTrailingSlashRedirect: true,
  outputFileTracingExcludes: {
    '*': [
      // Exclude @vercel/og and its WASM files (not used)
      'node_modules/@vercel/og/**/*',
      // Exclude Sanity Studio packages (not used in production app)
      'node_modules/@sanity/vision/**/*',
      'node_modules/@sanity/code-input/**/*',
      'node_modules/@sanity/ui/**/*',
      'node_modules/styled-components/**/*',
    ],
  },
};

export default withNextIntl(config);
