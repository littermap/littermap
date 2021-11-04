const apis = {
  littermap: config.backend.api
}

function createRequestAgent() {
  //
  // REST communication
  //
  async function request(api, method, url, data, field) {
    const opts = {
      method,
      headers: {},
      // Allow including cookie and other credential headers when communicating across domains while testing
      credentials: config.development ? 'include' : 'same-origin'
    }

    if (data) {
      opts.headers["Content-Type"] = "application/json"
      opts.body = JSON.stringify(data)
    }

    try {
      const response = await fetch(apis[api] + url, opts)
      const json = await response.json()

      return field ? json[field] : json
    } catch (err) {
      console.error("server error: ", err.message)

      return null
    }
  }

  const profile = {
    get: () => request("littermap", "get", "/profile", null, "profile"),
    logout: () => request("littermap", "get", "/logout")
  }

  const uploads = {
    getUploadLink: () => request("littermap", "get", "/getuploadlink")
  }

  return {
    profile,
    uploads
  }
}

export default createRequestAgent()
