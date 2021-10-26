import InfoBox from './InfoBox'
import Menu from './Menu'
import Store from '../store'

export default () => {
  const [store, { toggleMenu }] = Store()

  return (
    <>
      <header>
        <section id="site-nav">
          <div id="menu-toggle" onclick={toggleMenu} style={store.menuVisible ? "z-index: 102" : ""}>
            ≡
          </div>
          <div id="title">{window.config.title}</div>
        </section>
        <img id="logo" src="images/logo.svg" alt="logo" />
        <InfoBox />
      </header>
      {store.menuVisible && <Menu />}
    </>
  )
}
