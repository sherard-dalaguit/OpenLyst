import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	serverExternalPackages: ['pino', 'pino-pretty'],
	eslint: {
		ignoreDuringBuilds: true,
	},
	typescript: {
		ignoreBuildErrors: true,
	},
};

export default nextConfig;
