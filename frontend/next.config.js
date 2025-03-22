/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_SERVER_URL:
      process.env.NODE_ENV === "production"
        ? "http://13.209.41.52:8000/api" // 배포 환경
        : "http://localhost:8000/api", // 개발 환경
    NEST_PUBLIC_SERVER_URL:
      process.env.NODE_ENV === "production"
        ? "http://13.209.41.52:8000/api" // 배포 환경
        : "http://localhost:8000/api", // 개발 환경
  },
  reactStrictMode: false,
  images: {
    domains: [
      "nexus-s3cloud.s3.ap-northeast-2.amazonaws.com", // 외부 이미지 호스트 추가
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
