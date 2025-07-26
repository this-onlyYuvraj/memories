'use client'

import { LoadScript } from '@react-google-maps/api'

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <LoadScript
      googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
      libraries={['places']}
    >
      {children}
    </LoadScript>
  )
} 
