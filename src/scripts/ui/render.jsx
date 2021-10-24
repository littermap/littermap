import { render } from 'solid-js/web'
import { Router } from 'solid-app-router'
import { Provider } from './store'
import Main from './Main'

render(() => (
  <Router>
    <Provider>
      <Main />
    </Provider>
  </Router>
), document.getElementById('app'))
