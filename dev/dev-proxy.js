#!/usr/bin/env node

//
// This standalone script launches a local proxy that unifies the back-end api host with the local server under
// a single proxy host.
//
// This resolves the issues that arise in modern browsers due to security rules associated with cross-origin
// communication. The back-end does not even need to send headers refererncing cross-origin request permissions,
// since when using this proxy the browser never notices any cross-origin requests.
//
// Use this proxy when serving the app locally during testing.
//

const express = require('express')
const httpProxy = require('http-proxy-middleware')

const config = require('../config.json')

let proxy = httpProxy.createProxyMiddleware({
  target: 'http://localhost:3474',
  router: {
    '/api': config.dev.api_host
  },
  changeOrigin: true
})

const server = express()
server.use('/', proxy)
server.listen(9999)
