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
            // new: allow Google user-profile pics
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com',
                port: '',
                pathname: '/**',
            },
        ],
    },
};

export default nextConfig;
