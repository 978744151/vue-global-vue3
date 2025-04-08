import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import path from 'path'
import createVitePlugins from './plugins/index'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  plugins: [
    createVitePlugins(),
  ],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/styles/element/index.scss" as *;`,
        silenceDeprecations: ['legacy-js-api']
      },
    },
  },
  // vite 相关配置
  server: {
    port: 5177,
    host: true,
    open: true,
    proxy: {
      // https://cn.vitejs.dev/config/#server-proxy
      '/api': {
        target: 'http://192.168.2.67:8304/',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api/, '/')
      }
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '~': path.resolve(__dirname, './src'),
    },
  },
  build: {
    chunkSizeWarningLimit: 150000,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        chunkFileNames: 'js/[name]-[hash].js', // 引入文件名的名称
        entryFileNames: 'js/[name]-[hash].js', // 包的入口文件名称
        assetFileNames: '[ext]/[name]-[hash].[ext]', // 资源文件像 字体，图片等
        // 静态文件拆分打包
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString();
          }
        }
      }

    }
  },
})
