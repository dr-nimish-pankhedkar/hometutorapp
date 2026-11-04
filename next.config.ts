import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Old single-page demo routes → student platform
  async redirects() {
    return [
      { source: "/test", destination: "/tests", permanent: false },
      { source: "/report", destination: "/results", permanent: false },
    ];
  },
};

export default nextConfig;
