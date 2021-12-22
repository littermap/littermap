import { render } from 'solid-js/web'
import { Router } from 'solid-app-router'
import { StoreProvider } from './store'
import Main from './Main'

import './platform'

// Let `config` object injected by esbuild be accessible in the console (during development)
if (config.development)
  window.config = config

render(() => (
  <Router>
    <StoreProvider>
      <Main />
    </StoreProvider>
  </Router>
), document.getElementById('app'))
