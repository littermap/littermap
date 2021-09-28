import { lazy } from 'solid-js'
import { Router, useRoutes } from 'solid-app-router'
import { useStore } from '../store'
import Header from './Header'

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
  const [store] = useStore()
  const Routes = useRoutes(routes)

  return (
    <>
      <Header />
      <Routes />
    </>
  )
}
