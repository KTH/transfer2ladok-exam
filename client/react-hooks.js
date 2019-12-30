import { useState, useEffect } from 'react'

export function useFetch (url, method, body) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)

  async function fetchData () {
    setLoading(true)

    const options = { method: method || 'GET' }
    if (body) {
      options.body = JSON.stringify(body)
      options.headers = {
        'Content-Type': 'application/json'
      }
    }

    window
      .fetch(url, options)
      .then(r => {
        if (!r.ok) {
          throw new Error(r.statusText)
        }
        return r
      })
      .then(r => r.json())
      .then(body => {
        setData(body)
        setLoading(false)
      })
      .catch(r => {
        setError(r)
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchData()
  }, [url])

  return { loading, error, data }
}
