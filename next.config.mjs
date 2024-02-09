import withBundleAnalyzer from '@next/bundle-analyzer';
import './src/env.mjs';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};

export default withBundleAnalyzer({
  enabled: process.env.ANALYSIS == 'true',
  openAnalyzer: false,
})(nextConfig);
