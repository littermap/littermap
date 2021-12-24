//
// What's rendered over the map
//

import AddressSearch from './AddressSearch'
import ProfileAvatar from './ProfileAvatar'
import MapButtons from './MapButtons'
import HintBar from './HintBar'
import SocialButtons from './SocialButtons'
import Announcements from './Announcements'
import MainStore from '../store'

export default () => {
  const [store] = MainStore()

  return (
    <Show when={store.mapLoaded}>
      <Portal mount={document.getElementById('map')}>

        <Show when={!store.showingStreetView}>
          <AddressSearch />
          <ProfileAvatar />
          <MapButtons />
        </Show>

        <HintBar />
        <SocialButtons />
        <Announcements />
      </Portal>
    </Show>
  )
}
