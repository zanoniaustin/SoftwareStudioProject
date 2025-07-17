// next.config.ts
/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.pokemontcg.io',
                port: '',
                pathname: '/**',
            },
        ],
    },
};

export default nextConfig;
