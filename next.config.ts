import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["localhost", "res.cloudinary.com"], // Cho phép lấy ảnh từ localhost
  },
};

export default nextConfig;
