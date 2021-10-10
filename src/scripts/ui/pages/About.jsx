import { createEffect } from 'solid-js'
import { Link } from 'solid-app-router'
import { useStore } from '../../store'

export default () => {
  const [store, { hideMenu } ] = useStore()

  return (
    <div class="main page">
      <div class="content">
        <h1>About Us</h1>
        <h2>The Litter Map Project</h2>
        According to Greta Thunberg [citation needed] ...
        <h2>The Earth Stewards</h2>
        We started cleaning the planet after it was already too late. Learn more by picking up that plastic bottle.
        <h2>Terms of Service</h2>
        If you're curious how we collect your personal data, read out <Link href="/terms">terms</Link>.
      </div>
    </div>
  )
}
