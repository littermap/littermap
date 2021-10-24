import { lazy } from 'solid-js'
import { Router, useRoutes } from 'solid-app-router'
import Header from './parts/Header'
import ViewLocation from './parts/ViewLocation'
import EditNewLocation from './parts/EditNewLocation'

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
      {/* UI components detached from the main tree */}
      <ViewLocation />
      <EditNewLocation />
    </>
  )
}
