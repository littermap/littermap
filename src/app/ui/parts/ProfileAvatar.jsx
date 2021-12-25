//
// Current user icon
//

import MainStore from '../../main-store'

export default () => {
  const [store, { initiateLogin, logout }] = MainStore()

  const AnonProfilePic = () => (
    <svg viewBox="-50 -50 100 100">
      <g fill="#aaa">
        <circle cx="0" cy="-8" r="20" />
        <circle cx="0" cy="50" r="35" />
      </g>
    </svg>
  )

  return (
    <Switch>
      <Match when={store.profileLoading}>
        <div id="avatar">
          <div class="spinner" />
        </div>
      </Match>
      <Match when={store.loggingIn}>
        <div id="avatar">
          <AnonProfilePic />
          <div class="spinner" />
        </div>
      </Match>
      <Match when={!store.profile}>
        <a href={config.backend.api + '/login/google'} onclick={initiateLogin}>
          <div id="avatar">
            <AnonProfilePic />
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
  const size = 256

  // These appear to be the subdomains that serve the profile image
  const n = [3, 4, 5, 6][Math.random() * 4 | 0]

  // Strip the 'g:' prefix
  id = id.slice(2)

  //
  // Partially documented here: https://developers.google.com/people/image-sizing
  //
  return `https://lh${n}.googleusercontent.com/${id}=c-s${size}`
}
