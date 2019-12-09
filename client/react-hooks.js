import { useState, useEffect } from 'react'

export function useFetch (url) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)

  async function fetchData () {
    setLoading(true)

    window
      .fetch(url)
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

/**
 * Wrapper over "useState" hook. Only will set the new state if
 * `validation(newState)` doesn't throw.
 *
 * Returns the error thrown by "validation", the new state (always one of
 * them is null) and the setState function
 */
export function useValidatedState (initialState, validation) {
  const [currentState, setValidatedState] = useState({
    state: initialState,
    error: null
  })

  function setState (newState) {
    try {
      validation(newState)
      setValidatedState({
        state: newState,
        error: null
      })
    } catch (error) {
      setValidatedState({
        error,
        state: null
      })
    }
  }

  return [currentState.error, currentState.state, setState]
}
