import { render } from 'solid-js/web'
import { Provider } from './store'
import InfoBox from './ui/InfoBox'

render(() => (
  <Provider>
    <InfoBox />
  </Provider>
), document.getElementById('header'))
