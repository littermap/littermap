//
// What's rendered over the map
//

import AddressSearch from './AddressSearch'
import ProfileAvatar from './ProfileAvatar'
import MapButtons from './MapButtons'
import HintBar from './HintBar'
import SocialButtons from './SocialButtons'
import Announcements from './Announcements'
import PhotoViewer from './PhotoViewer'
import MainStore from '../store'

export default () => {
  const [store] = MainStore()

  return (
    <Show when={store.mapLoaded}>
      <Portal mount={document.getElementById('map')}>
        <Announcements />
        <HintBar />
        <SocialButtons />

        <Show when={!store.showingStreetView}>
          <ProfileAvatar />
          <MapButtons />
          <AddressSearch />
        </Show>

        <PhotoViewer />
      </Portal>
    </Show>
  )
}
