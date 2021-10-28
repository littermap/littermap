import { createEffect } from 'solid-js'
import { useStore } from '../../store'

export default () => {
  const [store, { hideMenu } ] = useStore()

  return (
    <div class="main page">
      <div class="content">
        <h1>Contact Us</h1>
        <p>
          Contact us on Instagram, Twitter and TikTok.
        </p>
        <p>
          We love you.
        </p>
      </div>
    </div>
  )
}
