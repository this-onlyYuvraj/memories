'use client'

import { useEffect, useRef } from 'react'

export interface CustomLocation {
  lat: number
  lng: number
  address: string
}


interface Props {
  onLocationSelect: (loc: CustomLocation) => void
  value?: string // <-- add this line
}

export default function LocationInput({ onLocationSelect, value }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (!window.google || !inputRef.current) return

    const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
      fields: ['formatted_address', 'geometry'],
    })

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace()
      if (!place.geometry?.location) return

      const lat = place.geometry.location.lat()
      const lng = place.geometry.location.lng()
      const address = place.formatted_address || ''

      onLocationSelect({ lat, lng, address })
    })
  }, [onLocationSelect])

  // Update the input value when `value` changes
  useEffect(() => {
    if (inputRef.current && value) {
      inputRef.current.value = value
    }
  }, [value])

  return (
    <input
      ref={inputRef}
      type="text"
      name="location"
      placeholder=''
      className="w-full border px-3 py-2 rounded-md text-pink-900 focus:outline-none focus:ring-2 focus:ring-pink-500"
    />
  )
}
