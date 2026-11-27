const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  publicPath: process.env.NODE_ENV === 'production'
    ? '/tool/'
    : '/',

  transpileDependencies: true,

  pluginOptions: {
    vuetify: {
      // Opciones de Vuetify
    }
  }
})
