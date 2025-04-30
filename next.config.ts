import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  serverExternalPackages: ["nodemailer"],

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

  images: {
    domains: ['localhost'],
  },
};

export default nextConfig;
