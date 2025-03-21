/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_SERVER_URL: "http://13.209.41.52:8000/api",
    NEST_PUBLIC_SERVER_URL: "http://13.209.41.52:8000/api",
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
