import { type KeyboardEvent, useEffect, useId, useMemo, useRef, useState } from 'react'

import { filterCountries } from '../../utils/countryAutocomplete'
import './CountryAutocomplete.css'

interface CountryAutocompleteProps {
  id: string
  name?: string
  countries: string[]
  value?: string
  placeholder?: string
  onChange?: (value: string) => void
  onBlur?: () => void
}

export function CountryAutocomplete({
  id,
  name,
  countries,
  value,
  placeholder = 'Country',
  onChange,
  onBlur,
}: CountryAutocompleteProps) {
  const isControlled = onChange !== undefined
  const listboxId = useId()
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [internalValue, setInternalValue] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)

  const inputValue = isControlled ? (value ?? '') : internalValue

  const filteredCountries = useMemo(
    () => filterCountries(countries, inputValue),
    [countries, inputValue],
  )

  const selectCountry = (country: string) => {
    if (!isControlled) {
      setInternalValue(country)
    }
    onChange?.(country)
    setIsOpen(false)
    setHighlightedIndex(-1)
  }

  const handleInputChange = (nextValue: string) => {
    if (!isControlled) {
      setInternalValue(nextValue)
    }
    onChange?.(nextValue)
    setIsOpen(true)
    setHighlightedIndex(-1)
  }

  const handleBlur = () => {
    onBlur?.()
    setIsOpen(false)
    setHighlightedIndex(-1)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
      setIsOpen(true)
      return
    }

    if (event.key === 'Escape') {
      setIsOpen(false)
      setHighlightedIndex(-1)
      return
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setHighlightedIndex((currentIndex) =>
        currentIndex < filteredCountries.length - 1 ? currentIndex + 1 : 0,
      )
      return
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault()
      setHighlightedIndex((currentIndex) =>
        currentIndex > 0 ? currentIndex - 1 : filteredCountries.length - 1,
      )
      return
    }

    if (event.key === 'Enter' && highlightedIndex >= 0) {
      event.preventDefault()
      const selectedCountry = filteredCountries[highlightedIndex]
      if (selectedCountry) {
        selectCountry(selectedCountry)
      }
    }
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setIsOpen(false)
        setHighlightedIndex(-1)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className='country-autocomplete' ref={wrapperRef}>
      <input
        id={id}
        name={name}
        type='search'
        role='combobox'
        aria-expanded={isOpen}
        aria-controls={listboxId}
        aria-autocomplete='list'
        value={inputValue}
        placeholder={placeholder}
        autoComplete='off'
        autoCorrect='off'
        spellCheck={false}
        data-lpignore='true'
        data-1p-ignore='true'
        onChange={(event) => handleInputChange(event.target.value)}
        onFocus={() => setIsOpen(true)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
      />
      {isOpen && filteredCountries.length > 0 && (
        <ul id={listboxId} role='listbox' className='country-autocomplete__list'>
          {filteredCountries.map((country, index) => (
            <li
              key={country}
              role='option'
              aria-selected={highlightedIndex === index}
              className={
                highlightedIndex === index
                  ? 'country-autocomplete__option country-autocomplete__option--highlighted'
                  : 'country-autocomplete__option'
              }
              onMouseDown={(event) => {
                event.preventDefault()
                selectCountry(country)
              }}
            >
              {country}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
