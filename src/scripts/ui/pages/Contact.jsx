import { createEffect } from 'solid-js'
import { useStore } from '../../store'

export default () => {
  const [store, { hideMenu } ] = useStore()

  createEffect(hideMenu)

  return (
    <div class="main page">
      <div class="content">
        <h1>Contact Us</h1>
        Contact us on Instagram, Twitter and TikTok. We love you.
      </div>
    </div>
  )
}
