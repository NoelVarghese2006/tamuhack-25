/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ensure 'eslint' only contains supported sub-keys
  eslint: {
    // Only use this if you want to allow production builds to succeed even if your project has ESLint errors.
    ignoreDuringBuilds: true,
  },

  // If you were using the legacy 'middleware' key for proxying, move that logic to 'rewrites'
  async rewrites() {
    return [
      // Example: proxying API requests to a backend
      // { source: '/api/:path*', destination: 'http://localhost:5000/:path*' }
    ];
  },
};

export default nextConfig;
