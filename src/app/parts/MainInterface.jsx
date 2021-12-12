//
// What's shown on top of everything
//

import { BurgerGlyph } from '../elements/glyphs'
import MainMenu from './MainMenu'
import MainStore from '../store'

export default () => {
  const [store, { toggleMenu }] = MainStore()

  return (
    <>
      <div id="menu-toggle" onclick={toggleMenu} style={store.showingMenu ? "z-index: 102" : ""}>
        <BurgerGlyph />
      </div>

      {store.showingMenu && <MainMenu />}
    </>
  )
}
