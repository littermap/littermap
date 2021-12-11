//
// Main menu
//

import { Link } from 'solid-app-router'
import MainStore from '../store'

export default () => {
  const [store, { hideMenu }] = MainStore()

  return (
    <>
      <div onclick={hideMenu} class="click-screen" />
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
