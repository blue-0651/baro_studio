import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    serverComponentsExternalPackages: ["nodemailer"],
  },
  async headers() {
    return [
      {
        source: "/api/quote",
        headers: [
          {
            key: "Content-Type",
            value: "multipart/form-data",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
