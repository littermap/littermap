import { useStore } from '../store'
import ProfileMenu from './ProfileMenu'

export default () => {
  const [store] = useStore()

  return (
    <>
      <section id="info">
        <div id="location-count">
          ...
        </div>
        <div>
          {store.profile ? store.profile.name : '\u00A0'}
        </div>
      </section>
      <ProfileMenu />
    </>
  )
}
