import type { NextConfig } from "next";
import { version } from "./package.json";

const nextConfig: NextConfig = {
  /* config options here */
  publicRuntimeConfig: {
    version: version,
  },
};

export default nextConfig;
