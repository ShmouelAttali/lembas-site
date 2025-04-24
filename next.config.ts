import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'alxnmevvoiawospmeuuo.supabase.co',
                port: '',
                pathname: '/storage/v1/object/public/product-images/**',
            },
        ],
    },
};

export default nextConfig;
