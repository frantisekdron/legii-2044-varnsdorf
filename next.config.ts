import type { NextConfig } from "next";

const githubPages = process.env.GITHUB_PAGES === "1";

const nextConfig: NextConfig = githubPages
  ? {
      output: "export",
      basePath: "/legii-2044-varnsdorf",
      trailingSlash: true,
      images: { unoptimized: true },
    }
  : {};

export default nextConfig;
