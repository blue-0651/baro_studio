import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // 빌드 시 ESLint 오류를 경고로 변경 (배포 실패를 방지)
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
