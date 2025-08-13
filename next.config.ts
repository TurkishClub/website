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
  skipTrailingSlashRedirect: true
};

export default withNextIntl(config);
