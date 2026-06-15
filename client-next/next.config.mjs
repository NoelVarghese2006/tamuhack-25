/** @type {import('next').NextConfig} */
const nextConfig = {
  //NOTE: If you want linting need to added to build command in package.json
  // If you were using the legacy 'middleware' key for proxying, move that logic to 'rewrites'
  async rewrites() {
    return [
      // Example: proxying API requests to a backend
      // { source: '/api/:path*', destination: 'http://localhost:5000/:path*' }
    ];
  },
};

export default nextConfig;
