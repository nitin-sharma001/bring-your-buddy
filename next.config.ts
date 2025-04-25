import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
// };

// export default nextConfig;


const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /\.node$/,
      type: 'asset/resource',
    });
    

    return config;
  },

  reactStrictMode: false,
};

module.exports = nextConfig;
