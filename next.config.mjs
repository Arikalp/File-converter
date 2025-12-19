/**
 * Next.js Configuration for File Converter
 * 
 * Important configurations for production deployment:
 * - Sharp is automatically optimized for serverless environments
 * - Experimental features enabled for better performance
 */
const nextConfig = {
  // Enable strict mode for better error detection in development
  reactStrictMode: true,

  // Optimize images (though we're processing them server-side)
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
  },

  // Server Actions configuration
  experimental: {
    // Increase the default server action body size limit if needed
    // Default is 1MB, we're using 10MB for file uploads
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },

  // Enable compression for better performance
  compress: true,

  // Output configuration for standalone deployment
  output: 'standalone',

  // Headers for security
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
