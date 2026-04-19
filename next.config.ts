import type { NextConfig } from 'next'
import path from 'path'

const nextConfig: NextConfig = {
  reactStrictMode: true,

  turbopack: {
    // Anchor Turbopack to THIS worktree only — prevents it from crawling the
    // parent project's node_modules (which causes the PC freeze + loop)
    root: path.resolve(__dirname),
  },

  // Tell the webpack watcher (used during static generation) to ignore the
  // parent directory and its node_modules
  webpack(config, { dev }) {
    if (dev) {
      config.watchOptions = {
        ...config.watchOptions,
        ignored: [
          '**/node_modules/**',
          '**/.git/**',
          // Ignore everything outside this worktree
          path.resolve(__dirname, '../../..') + '/**',
        ],
      }
    }
    return config
  },
}

export default nextConfig
