//
// Extendable list of remote services
//
const remotes = {
  main: config.routes.api
}

async function request({ api = "main", method = "get", endpoint, field, payload }) {
  if (config.debug.network)
    console.info("Making request:", endpoint)

  const opts = {
    method
  }

  if (payload) {
    opts.headers = { "Content-Type": "application/json" }
    opts.body = JSON.stringify(payload)
  }

  let response, receivedData

  try {
    response = await fetch(remotes[api] + endpoint, opts)

    if (config.debug.network) {
      console.info("Reponse from endpoint:", endpoint)
      console.info(response)
    }

    if (!response.ok) {
      console.error("Server returned status: " + response.status)

      // Response body
      console.error(await response.text())

      return undefined
    }
  } catch (e) {
    console.error("HTTP fetch error")
    console.error(e)

    return undefined
  }

  try {
    receivedData = await response.json()
  } catch (e) {
    console.error("Received response from server is not valid JSON as expected")
    console.error(e)

    return undefined
  }

  if (config.debug.network) {
    console.info("Received data from endpoint:", endpoint)
    console.info(receivedData)
  }

  // If the service explicitly returned an error...
  if (receivedData.error) {
    console.error(receivedData)

    return undefined
  }

  //
  // If the request was for a specific field, return just that field
  //
  return field ? receivedData[field] : receivedData
}

export default {
  profile: {
    get: () => request({
      endpoint: "/profile",
      field: "profile"
    }),
    logout: () => request({
      endpoint: "/logout"
    })
  },
  uploads: {
    getUploadLink: () => request({
      endpoint: "/getuploadlink"
    })
  },
  location: {
    get: () => request({
      endpoint: "/mylocation"
    })
  }
}
