import type { NextConfig } from 'next'
import path from 'path'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  turbopack: {
    // Point to this worktree's own root to avoid the multi-lockfile warning
    root: path.resolve(__dirname),
  },
}

export default nextConfig
