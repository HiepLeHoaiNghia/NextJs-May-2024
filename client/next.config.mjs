/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Định nghĩa các domain cần phục vụ ảnh
    remotePatterns: [
      {
        // Giao thức của domain
        protocol: 'https',
        // Tên miền của domain
        hostname: 'images.pexels.com',
        // Port của domain
        port: '',
        // Path của domain
        // Cho phép tất cả các path của domain này sau /photos/
        pathname: '/photos/**'
      }
    ]
  }
}

export default nextConfig
