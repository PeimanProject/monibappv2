import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
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
  turbopack: {
    // Add any Turbopack specific configurations here
  },
};

export default withNextIntl(nextConfig);
