//
// Main menu
//

import { Link } from 'solid-app-router'
import MainStore from '../../main-store'

export default () => {
  const [, { hideMenu }] = MainStore()

  return (
    <nav id="menu">
      <ul>
        <Link href="/">
          <li onclick={hideMenu}>Map</li>
        </Link>
        <Link href="/about">
          <li onclick={hideMenu}>About</li>
        </Link>
        <Link href="/faq">
          <li onclick={hideMenu}>FAQ</li>
        </Link>
        <Link href="/contact">
          <li onclick={hideMenu}>Contact</li>
        </Link>
      </ul>
    </nav>
  )
}
