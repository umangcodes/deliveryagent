/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        BACKEND_API: `${process.env.NEXT_PUBLIC_APP_BACKEND}`,
      }
};

export default nextConfig;
