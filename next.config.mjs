const nextConfig = {
  reactStrictMode: false,
  // output: 'export',
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "assets.monibapp.ir",
        port: "",
      },
      {
        protocol: "https",
        hostname: "verse.monib.ai",
        port: "",
      },
      {
        protocol: "https",
        hostname: "bundles.monibapp.ir",
        port: "",
      },
      {
        protocol: "https",
        hostname: "stream.monibapp.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "irstream.monibapp.ir",
        port: "",
      },
    ],
  },
};

export default nextConfig;
