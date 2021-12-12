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

const config = require('../config.json')

const express = require('express')
const httpProxy = require('http-proxy-middleware')
const createCert = require('create-cert')
const https = require('https')

const port = config.dev.serve_port || 9999

let proxy = httpProxy.createProxyMiddleware({
  target: 'http://localhost:3474',
  router: {
    '/api': config.dev.api_host,
    '/media': config.dev.media_host
  },
  changeOrigin: true
})

console.log()

;(async () => {
  console.info("Generating self-signed SSL certificate...\n")
  const keys = await createCert()

  const app = express()
  app.use('/', proxy)

  https.createServer(keys, app).listen(
    port,
    () => {
      console.info("Launch the app:", `https://localhost:${port}`, "(don't be bothered by the SSL certificate warning)")
    }
  )
})()
