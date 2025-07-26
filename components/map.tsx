'use client'

import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api"

interface MapProps {
  location: {
    title: string
    lat: number
    lng: number
  }
}

export default function Map({ location }: MapProps) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  })

  if (loadError) return <div>Error loading map</div>
  if (!isLoaded) return <div>Loading map...</div>

  return (
    <GoogleMap
      mapContainerStyle={{ width: "100%", height: "100%" }}
      zoom={8}
      center={{ lat: location.lat, lng: location.lng }}
    >
      <Marker position={{ lat: location.lat, lng: location.lng }} title={location.title}/>
    </GoogleMap>
  )
}
