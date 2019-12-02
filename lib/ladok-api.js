/** Module to communicate with Ladok API */
const got = require('got')

let ladokGot

function removeSSL (err) {
  delete err.gotOptions
  return err
}

/**
 * Converts a "normal generator" function to an "extended generator" function
 *
 * - The input (a normal generator) is a function that returns an
 *   Iterable object.
 * - The output (an "extended" generator) is a function that returns an
 *   ExtendedIterable, which is like a normal Iterable but with extra methods.
 */
const augmentIterator = generator =>
  function extendedGenerator (...args) {
    const iterable = generator(...args)

    iterable.toArray = async function () {
      const result = []

      for await (const v of iterable) {
        result.push(v)
      }

      return result
    }

    return iterable
  }

function init () {
  ladokGot = got.extend({
    pfx: Buffer.from(process.env.LADOK_API_PFX_BASE64, 'base64'),
    passphrase: process.env.LADOK_API_PFX_PASSPHRASE,
    prefixUrl: process.env.LADOK_API_BASEURL
  })
}

async function get (endpoint) {
  let options = {}

  if (endpoint.startsWith('/kataloginformation')) {
    options = {
      headers: {
        Accept: 'application/vnd.ladok-kataloginformation+json'
      }
    }
  }

  try {
    return ladokGot(endpoint, options).json()
  } catch (err) {
    throw removeSSL(err)
  }
}

async function requestUrl (endpoint, method = 'POST', body) {
  try {
    const response = await ladokGot(endpoint, {
      json: body,
      method
    })

    return response
  } catch (e) {
    throw removeSSL(e)
  }
}

async function * sokPaginated (endpoint, criteria) {
  const size = await ladokGot(endpoint, {
    method: 'PUT',
    json: {
      ...criteria,
      Page: 1,
      Limit: 1
    }
  }).json().then(r => r.TotaltAntalPoster)

  let page = 0
  while (size > page * 100) {
    page++

    try {
      const response = await ladokGot(endpoint, {
        method: 'PUT',
        json: {
          ...criteria,
          Page: page,
          Limit: 100
        }
      }).json()

      yield response
    } catch (err) {
      throw removeSSL(err)
    }
  }
}

async function * sok (endpoint, criteria, key) {
  for await (const page of sokPaginated(endpoint, criteria)) {
    for (const element of page[key]) {
      yield element
    }
  }
}

module.exports = {
  init,

  /** Perform a GET request to a given `endpoint` */
  get,

  /** Perform a non-GET request to a given `endpoint` */
  requestUrl,

  /** Perform a PUT request to an "/sok" endpoint */
  sok: augmentIterator(sok)
}
