//
// Main menu
//

import { Link } from 'solid-app-router'
import MainStore from '../../main-store'

export default () => {
  const [store, { hideMenu }] = MainStore()

  return (
    <>
      <div class="click-screen" onclick={hideMenu} />

      <nav id="menu">
        <ul>
          <Link href="/">
            <li onclick={hideMenu}>Map</li>
          </Link>
          <Link href="/about">
            <li onclick={hideMenu}>About</li>
          </Link>
          <Link href="/contact">
            <li onclick={hideMenu}>Contact</li>
          </Link>
        </ul>
      </nav>
    </>
  )
}
