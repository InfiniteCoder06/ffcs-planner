import type { NextConfig } from "next";
import { version } from "./package.json" with { type: "json" };

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    NEXT_PUBLIC_APP_VERSION: version,
  },
};

export default nextConfig;
