/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        // BACKEND_API: `${process.env.NEXT_PUBLIC_APP_BACKEND}`,
        BACKEND_API: 'http://localhost:5000'
      }
};

export default nextConfig;
