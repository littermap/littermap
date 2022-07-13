import { createResource } from 'solid-js'
import network from '../requests'

export default (actions) => {
  const [profile, { mutate }] = createResource(network.profile.get)

  Object.assign(actions, {
    async logout() {
      try {
        await network.profile.logout()

        // Set the logged in profile to "none"
        mutate(null)

        console.info("Logged out")
      } catch(e) {
        console.error("Error logging out:", e.message)
      }
    }
  })

  return profile
}
