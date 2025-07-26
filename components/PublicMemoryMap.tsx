// component/PublicMemoryMap.tsx
'use client'
import { GoogleMap, useLoadScript } from '@react-google-maps/api'

interface Memory {
  id: string
  title: string
  description: string
  location: string
  lat: number
  lng: number
  photos: string[]
  startDate: string
  endDate: string
  user: {
    name: string
  }
}

interface Props {
  memories: Memory[]
  onMapClick: (lat: number, lng: number) => void
}

const mapContainerStyle = {
  width: '100%',
  height: '100%',
}

export default function PublicMemoryMap({ memories, onMapClick }: Props) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  })

  if (!isLoaded) return <div>Loading Map...</div>

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      zoom={2}
      center={{ lat: 20, lng: 0 }}
      onClick={(e) => {
        if (e.latLng) {
          onMapClick(e.latLng.lat(), e.latLng.lng())
        }
      }}
    />
  )
}
