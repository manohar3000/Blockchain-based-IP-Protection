import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      // Whether to polyfill `node:` protocol imports.
      protocolImports: true,
    }),
  ],
  resolve: {
    alias: {
      // This is needed for @web3-react/injected-connector
      events: 'events',
      // Add other Node.js built-ins that might be needed
      stream: 'stream-browserify',
      http: 'http-browserify',
      https: 'https-browserify',
      os: 'os-browserify/browser',
      crypto: 'crypto-browserify'
    }
  },
  optimizeDeps: {
    include: ['@web3-react/injected-connector'],
    esbuildOptions: {
      // Node.js global to browser globalThis
      define: {
        global: 'globalThis'
      }
    }
  },
})
