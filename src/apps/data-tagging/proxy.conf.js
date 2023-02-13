const PROXY_CONFIG = [
  {
    context: ['/api/**'],
    target: 'https://ui-demo-fvs74wqata-ew.a.run.app',
    secure: false,
    logLevel: 'debug',
    changeOrigin: true,
    "pathRewrite": {
      "^/api": ""
    }
  }
];

module.exports = PROXY_CONFIG;
