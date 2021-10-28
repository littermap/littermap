import { createSignal } from "solid-js"

export default (agent, actions) => {
  const [getProfile, setProfile] = createSignal()

  Object.assign(actions, {
    async fetchProfile() {
      try {
        let profile = await agent.profile.get()
        setProfile(profile)
      } catch(e) {
        console.error("Error fetching profile:", e.message)
      }
    },
    async logout() {
      setProfile(false)

      try {
        await agent.profile.logout()
        alert("You've been logged out")
      } catch(e) {
        console.error("Error logging out:", e.message)
      }
    }
  })

  return getProfile
}
