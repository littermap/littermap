import { lazy } from 'solid-js'
import { Router, useRoutes } from 'solid-app-router'
import Header from './Header'

// This ensures that the code in '../map.js' gets initialized so that the Google Maps script can call initMap()
import {} from '../map'
// This ensures that the code in '../predict.js' gets initialized so that the fetch works on browser side
import {} from '../predict'

const routes = [ {
  path: "/",
  component: lazy(() => import('./pages/Map'))
}, {
  path: "/about",
  component: lazy(() => import('./pages/About'))
}, {
  path: "/contact",
  component: lazy(() => import('./pages/Contact'))
}, {
  path: "/terms",
  component: lazy(() => import('./pages/Terms'))
} ]

export default () => {
  const Routes = useRoutes(routes)

  return (
    <>
      <Header />
      <Routes />
    </>
  )
}
