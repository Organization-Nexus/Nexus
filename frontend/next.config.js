/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {},
  reactStrictMode: false,
  images: {
    domains: [
      "nexus-s3cloud.s3.ap-northeast-2.amazonaws.com", // 외부 이미지 호스트 추가
    ],
  },
};

module.exports = nextConfig;
