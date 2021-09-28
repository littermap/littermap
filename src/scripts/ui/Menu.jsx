import { Link } from 'solid-app-router'
import { useStore } from '../store'

export default () => {
  const [store, {hideMenu}] = useStore()

  return (
    <>
      <div onclick={hideMenu} class="click-screen" />
      <nav id="menu">
        <Link href="/">
          <li>Map</li>
        </Link>
        <Link href="/about">
          <li>About</li>
        </Link>
        <Link href="/contact">
          <li>Contact</li>
        </Link>
      </nav>
    </>
  )
}
