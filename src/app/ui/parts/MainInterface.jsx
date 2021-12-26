//
// What's shown on top of everything
//

import { BurgerGlyph } from '../elements/glyphs'
import MainMenu from './MainMenu'
import MainStore from '../../main-store'

export default () => {
  const [store, { toggleMenu, hideMenu }] = MainStore()

  return (
    <>
      {store.showingMenu && <div class="click-screen" onclick={hideMenu} />}

      <div id="menu-toggle" onclick={toggleMenu}>
        <BurgerGlyph />
      </div>

      {store.showingMenu && <MainMenu />}
    </>
  )
}
