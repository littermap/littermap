import { lazy } from 'solid-js'
import { useRoutes } from 'solid-app-router'
import Header from './parts/Header'
import MapControls from './parts/MapControls'
import ViewLocation from './parts/ViewLocation'
import EditNewLocation from './parts/EditNewLocation'

const routes = [ {
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
  const Page = useRoutes(routes)

  return (
    <>
      <Header />
      <main>
        <div id="map">
          <MapControls />
          {/* Components rendered inside the map */}
          <ViewLocation />
          <EditNewLocation />
        </div>
        <Page />
      </main>
    </>
  )
}
