import vue from '@vitejs/plugin-vue'

import createAutoImport from './auto-import'
import vueJsx from '@vitejs/plugin-vue-jsx'

export default function createVitePlugins(viteEnv?: {}, isBuild = false) {
    const vitePlugins = [vue(), vueJsx()]
    vitePlugins.push(createAutoImport())
    return vitePlugins
}
