import { createResource } from "solid-js"

export default (agent, actions) => {
  const [profile, {mutate}] = createResource(agent.profile.get)

  Object.assign(actions, {
    async logout() {
      mutate(false)

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
