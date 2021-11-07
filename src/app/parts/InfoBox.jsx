import ProfileMenu from './ProfileMenu'
import MainStore from '../store'

export default () => {
  const [store] = MainStore()

  return (
    <>
      <section id="info">
        <div>
          {store.profile ? store.profile.name : ''}
        </div>
      </section>
      <ProfileMenu />
    </>
  )
}
