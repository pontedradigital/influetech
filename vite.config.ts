import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
      proxy: {
        '/api/melhor-envio': {
          target: env.VITE_MELHOR_ENVIO_SANDBOX === 'false'
            ? 'https://melhorenvio.com.br/api/v2'
            : 'https://sandbox.melhorenvio.com.br/api/v2',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/melhor-envio/, ''),
          configure: (proxy, options) => {
            proxy.on('proxyReq', (proxyReq, req, res) => {
              // Adicionar headers obrigatórios
              proxyReq.setHeader('Authorization', `Bearer ${env.VITE_MELHOR_ENVIO_TOKEN || ''}`);
              proxyReq.setHeader('User-Agent', `${env.VITE_APP_NAME || 'InflueTech'} (${env.VITE_APP_EMAIL || 'contato@influetech.com.br'})`);
            });
          }
        },
        '/api': {
          target: 'http://localhost:3001',
          changeOrigin: true,
          secure: false,
        }
      }
    },
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }
  };
});
