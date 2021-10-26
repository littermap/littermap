import { Switch, Match } from 'solid-js'
import Store from '../store'

export default () => {
  const [store, { logout }] = Store()

  return (
    <Switch>
      <Match when={store.profileLoading}>
        <div id="avatar" />
      </Match>
      <Match when={!store.profile && !store.profileLoading}>
        <a href={config.backend + '/login/google'}>
          <div id="avatar">
            <svg viewBox="-50 -50 100 100">
              <g fill="#aaa">
                <circle cx="0" cy="-8" r="20" />
                <circle cx="0" cy="50" r="35" />
              </g>
            </svg>
          </div>
        </a>
      </Match>
      <Match when={store.profile}>
        <div id="avatar" class="logged-in" onclick={logout}>
          <img src={avatarURL(store.profile.avatar)} />
        </div>
      </Match>
    </Switch>
  )
}

function avatarURL(id) {
  const n = [3, 4, 5, 6][Math.random() * 4 | 0]
  const size = 256

  // Strip the 'g:' prefix
  id = id.slice(2)

  //
  // Partially documented here: https://developers.google.com/people/image-sizing
  //
  return `https://lh${n}.googleusercontent.com/${id}=c-s${size}`
}
