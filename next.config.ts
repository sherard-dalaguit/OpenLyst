import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	serverExternalPackages: ['pino', 'pino-pretty'],
	async redirects() {
		return [
			{
				source: "/:path*",
				has: [{ type: "host", value: "openlyst.io" }],
				destination: "https://www.openlyst.io/:path*",
				permanent: true,
			},
		];
	},
	eslint: {
		ignoreDuringBuilds: true,
	},
	typescript: {
		ignoreBuildErrors: true,
	},
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "encrypted-tbn0.gstatic.com",
				port: "",
			},
			{
				protocol: "https",
				hostname: "lh3.googleusercontent.com",
				port: "",
			},
			{
				protocol: "https",
				hostname: "avatars.githubusercontent.com",
				port: "",
			},
		],
	},
};

export default nextConfig;
