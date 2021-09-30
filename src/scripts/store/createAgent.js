const apis = {
  littermap: config.backend
}

export default function createAgent([state, actions]) {
  //
  // Communicate with a service
  //
  async function request(api, method, url, data, resultField) {
    const headers = {}
    const opts = {
      method,
      headers,
      // Allow including cookie and other credential headers when communicating across domains while testing
      credentials: config.development ? 'include' : 'same-origin'
    }

    if (data) {
      headers["Content-Type"] = "application/json"
      opts.body = JSON.stringify(data)
    }

    try {
      const response = await fetch(apis[api] + url, opts)
      const json = await response.json()

      return resultField ? json[resultField] : json
    } catch (err) {
      console.error("server error: ", err.message)

      return err
    }
  }

  //
  // Profile methods
  //
  const profile = {
    get: () => request("littermap", "get", "/profile", null, "profile"),
    logout: () => request("littermap", "get", "/logout")
  }

  return {
    profile
  }
}
