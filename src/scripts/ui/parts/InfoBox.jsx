import { useStore } from '../store'
import ProfileMenu from './ProfileMenu'

export default () => {
  const [store] = useStore()

  return (
    <>
      <section id="info">
        <div>
          {store.profile ? store.profile.name : 'Logged out'}
        </div>
      </section>
      <ProfileMenu />
    </>
  )
}
