import { render } from 'solid-js/web'
import { Router } from 'solid-app-router'
import { StoreProvider } from './store'
import Main from './Main'

import '../platform'

render(() => (
  <Router>
    <StoreProvider>
      <Main />
    </StoreProvider>
  </Router>
), document.getElementById('app'))
