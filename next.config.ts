import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Configuration expérimentale
  experimental: {
    // Désactiver les fonctionnalités expérimentales pour le moment
  },
  // Désactiver la vérification TypeScript pendant la construction
  typescript: {
    ignoreBuildErrors: true,
  },
  // Configuration des en-têtes CORS
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,POST,PUT,DELETE,OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "Content-Type, Authorization" },
        ],
      },
    ]
  },
  // Redirection des requêtes API vers le backend Laravel
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:8001/api/:path*",
      },
    ]
  },
};

export default nextConfig;
