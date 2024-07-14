import { useEffect, useRef, useState } from 'react'

import { Log } from '../utils/utils'

const LS_SEARCH_TERM_KEY = 'SavedSearchTerm'

export const useSyncSearchTermWithLocalStorage = () => {
  const storedValue = localStorage.getItem(LS_SEARCH_TERM_KEY)

  const [searchTerm, setSearchTerm] = useState(storedValue ? storedValue : '')

  const searchTermSetDuringStateInit = useRef(true)

  // one useEffect hook for saving to LocalStorage - runs everytime
  // `searchTerm` state changes (depends on reactive state `searchTerm`):
  useEffect(() => {
    // important detail: we initialize searchTerm with value from LocalStorage
    // that's why we don't need to run this hook first time (skip circular saving to LocalStorage)
    if (searchTermSetDuringStateInit.current) {
      Log(`skipping first searchTerm change, as it was done in state initialization stage`)
      searchTermSetDuringStateInit.current = false
      return
    }

    Log(`searTerm changed: saving to Local storage ${searchTerm}`)
    localStorage.setItem(LS_SEARCH_TERM_KEY, searchTerm)
  }, [searchTerm])

  // another useEffect hook for reading/saving searchTerm from/to LocalStorage
  // runs only on onMount/onUnmount
  useEffect(() => {
    // We don't need to restore SearchTerm onMount useEffect, because
    // we did it on state initialization step. But we could,
    // (if you believe Techincal requirements asked us) to do it here:
    const storedValue = localStorage.getItem(LS_SEARCH_TERM_KEY)
    Log(`onMount reading from Local Storage ${storedValue}`)
    //setSearchTerm(storedValue ? storedValue : '')

    return () => {
      // also we actually dont need onUnmount either: searchTerm is already
      // saved to Local storage by first hook
      Log('onUnmount callback')
    }
  }, [])

  return { searchTerm, setSearchTerm }
}
