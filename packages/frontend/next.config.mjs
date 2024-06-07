/** @type {import('next').NextConfig} */
const nextConfig = {
    output: process.env.NEXTJS_BUILD_MODE ? 'export' : 'standalone'
};

export default nextConfig;
