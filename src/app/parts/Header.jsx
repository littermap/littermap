import InfoBox from './InfoBox'
import Menu from './Menu'
import MainStore from '../store'

export default () => {
  const [store, { toggleMenu }] = MainStore()

  return (
    <>
      <header>
        <section id="site-nav">
          <div id="menu-toggle" onclick={toggleMenu} style={store.showingMenu ? "z-index: 102" : ""}>
            ≡
          </div>
          <div id="title">{config.title}</div>
        </section>
        <img id="logo" src="/images/logo.svg" alt="logo" />
        <InfoBox />
      </header>
      {store.showingMenu && <Menu />}
    </>
  )
}
