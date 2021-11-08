const apis = {
  littermap: config.backend.api
}

function createRequestAgent() {
  //
  // REST communication
  //
  async function request(api, method, url, sendData, field) {
    const opts = {
      method
    }

    if (sendData) {
      opts.headers = { "Content-Type": "application/json" }
      opts.body = JSON.stringify(sendData)
    }

    let response, receivedData

    try {
      response = await fetch(apis[api] + url, opts)
    } catch (e) {
      throw "Fetch error:" + e.message
    }

    try {
      receivedData = await response.json()
    } catch (e) {
      throw "Server response is not valid JSON"
    }

    return field ? receivedData[field] : receivedData
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
