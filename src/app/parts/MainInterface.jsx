//
// What's shown on top of everything
//

import MainMenu from './MainMenu'
import MainStore from '../store'

export default () => {
  const [store, { toggleMenu }] = MainStore()

  return (
    <>
      <div id="menu-toggle" onclick={toggleMenu} style={store.showingMenu ? "z-index: 102" : ""}>
        ≡
      </div>

      {store.showingMenu && <MainMenu />}
    </>
  )
}
