import { createResource } from 'solid-js'
import agent from '../requests'

export default (actions) => {
  const [profile, { mutate }] = createResource(agent.profile.get)

  Object.assign(actions, {
    async logout() {
      // Set the logged in profile to "none"
      mutate(null)

      try {
        await agent.profile.logout()
        console.info("Logged out")
      } catch(e) {
        console.error("Error logging out:", e.message)
      }
    }
  })

  return profile
}
