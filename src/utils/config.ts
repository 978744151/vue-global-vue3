
// 开发环境地址
const env = import.meta.env.MODE
const config = {
  app: { url: 'http://app-microfront.dev.gpyh.com', appName: 'g-app' },
  user: { url: 'http://user-microfront.dev.gpyh.com', appName: 'g-user' },
  home: { url: 'http://micro-iframe.dev.gpyh.com', appName: 'g-home' },
  // login: {url:'http://cas-microfront.dev.gpyh.com',appName:'g-login'}
}


if (env === 'development') {
  config.app = { url: 'http://localhost:5174', appName: 'g-app' }
  // config.login = { url: 'http://localhost:5173', appName: 'g-login' }
}


// 开发环境地址


// // 线上环境地址
// if (process.env.NODE_ENV === 'production') {
//   // 基座应用和子应用部署在同一个域名下，这里使用location.origin进行补全
//   Object.keys(config).forEach((key) => {
//     config[key] = window.location.origin
//   })

//   // 在部署后，nextjs11和nuxtjs2依然和开发环境保持一致，绑定5006和6006端口，这里单独处理
//   const { protocol, hostname } = window.location
//   config.nextjs11 = `${protocol}//${hostname}:5006`
//   config.nuxtjs2 = `${protocol}//${hostname}:6006`
// }

export default config