//
// Makes a server call to determine your location (based on CloudFront)
//

import network from '../requests'
import { goTo } from '../map'

;(async () => {
  let res = await network.location.get()

  if (res) {
    if (res.lat && res.lon)
      goTo(res)
    else
      console.error('Server could not determine your current location')
  }
})()
