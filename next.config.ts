import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["localhost"], // Cho phép lấy ảnh từ localhost
  },
};

export default nextConfig;
