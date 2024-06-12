import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueDevTools from 'vite-plugin-vue-devtools'
import Components from 'unplugin-vue-components/vite'
import { PrimeVueResolver } from 'unplugin-vue-components/resolvers'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        VueDevTools(),
        Components({
            resolvers: [PrimeVueResolver()]
        }),
        VitePWA({
            registerType: 'autoUpdate',
            devOptions: {
                enabled: true
            },
            includeAssets: ['logo.png'],
            manifest: {
                name: '灵犀气象——合你心意的气象大数据平台',
                short_name: '灵犀气象',
                description: '合你心意的气象大数据平台',
                theme_color: '#ffffff',
                icons: [
                    {
                        src: 'logo.png',
                        sizes: '192x192',
                        type: 'image/png'
                    }
                ]
            }
        })
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    }
})
