/**
 * Initialize TLS settings for DigitalOcean self-signed certificates
 * This must be called at app startup before any database connections
 */
export function initTLS() {
  if (process.env.NODE_ENV === 'production' && process.env.DATABASE_URL?.includes('digitalocean')) {
    // Allow self-signed certificates from DigitalOcean
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  }
}
