import { render } from 'solid-js/web'
import { Router } from 'solid-app-router'
import { MainStoreProvider as Store } from './main-store'
import Main from './ui/Main'

import './platform'

// Let `config` object injected by esbuild be accessible in the console (during development)
if (config.development)
  window.config = config

import './utils/cloudfront-geolocation'

render(() => (
  <Router>
    <Store>
      <Main />
    </Store>
  </Router>
), document.getElementById('app'))
