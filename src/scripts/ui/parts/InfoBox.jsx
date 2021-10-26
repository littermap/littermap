import ProfileMenu from './ProfileMenu'
import Store from '../store'

export default () => {
  const [store] = Store()

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
