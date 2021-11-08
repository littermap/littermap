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
      headers: {}
    }

    if (data) {
      opts.headers["Content-Type"] = "application/json"
      opts.body = JSON.stringify(data)
    }

    let response, json

    try {
      response = await fetch(apis[api] + url, opts)
    } catch (e) {
      console.info("Fetch error:", e.message)
      return null
    }

    try {
      json = await response.json()
    } catch (e) {
      console.info("Server response is not valid JSON")
      return null
    }

    return field ? json[field] : json
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
