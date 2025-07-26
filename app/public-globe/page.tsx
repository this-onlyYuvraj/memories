// /app/public-globe/page.tsx

'use client'

import { useEffect, useRef, useState } from 'react'
import Globe, { GlobeMethods } from 'react-globe.gl'
import Image from 'next/image'
import { format } from 'date-fns'
import dynamic from 'next/dynamic'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'

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

const MapComponent = dynamic(() => import('@/components/PublicMemoryMap'), {
  ssr: false,
})

export default function PublicGlobePage() {
  const globeRef = useRef<GlobeMethods | undefined>(undefined)
  const [memories, setMemories] = useState<Memory[]>([])
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [mode, setMode] = useState<'globe' | 'map'>('globe')
  const [lightboxIndex, setLightboxIndex] = useState<number>(-1)

  useEffect(() => {
    const fetchPublicMemories = async () => {
      try {
        const res = await fetch('/api/public-memories')
        const data = await res.json()
        setMemories(data)
      } catch (error) {
        console.error('Failed to fetch public memories', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPublicMemories()
  }, [])

  useEffect(() => {
    if (mode === 'globe' && globeRef.current) {
      globeRef.current.controls().autoRotate = true
      globeRef.current.controls().autoRotateSpeed = 0.8
    }
  }, [mode])

  const handleGlobeClick = ({ lat, lng }: { lat: number; lng: number }) => {
    if (!memories.length) return

    let closest: Memory | null = null
    let minDistance = Number.MAX_VALUE

    for (const memory of memories) {
      const dist = haversineDistance(lat, lng, memory.lat, memory.lng)
      if (dist < minDistance) {
        minDistance = dist
        closest = memory
      }
    }

    if (closest) {
      setSelectedMemory(closest)
    }
  }

  const haversineDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const toRad = (x: number) => (x * Math.PI) / 180
    const R = 6371
    const dLat = toRad(lat2 - lat1)
    const dLon = toRad(lon2 - lon1)
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fcc5c0] to-[#fa9fb5] text-pink-900 px-4 md:px-6 py-10">
      <div className="p-4 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2" style={{ fontFamily: 'vamos' }}>
          The Public Globe
        </h1>
        <p className="text-sm text-[#7a0177]">Tap anywhere to see shared memory!</p>
      </div>

      {/* Toggle Buttons */}
      <div className="flex justify-center mb-6 gap-3 flex-wrap">
        <button
          onClick={() => setMode('globe')}
          className={`px-5 py-2 text-sm sm:text-base rounded-full font-medium transition-colors ${
            mode === 'globe'
              ? 'bg-pink-500 text-white shadow'
              : 'bg-white text-pink-500 border border-pink-300 hover:bg-pink-100'
          }`}
        >
          Globe View
        </button>
        <button
          onClick={() => setMode('map')}
          className={`px-5 py-2 text-sm sm:text-base rounded-full font-medium transition-colors ${
            mode === 'map'
              ? 'bg-pink-500 text-white shadow'
              : 'bg-white text-pink-500 border border-pink-300 hover:bg-pink-100'
          }`}
        >
          Map View
        </button>
      </div>

      {/* Globe / Map Container */}
      <div className="w-full max-w-7xl mx-auto">
        <div className="border bg-[#fa9fb5] rounded-xl shadow-lg overflow-hidden">
          <div className="relative w-full h-[60vh] sm:h-[70vh] md:h-[80vh]">
            {isLoading ? (
              <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
              </div>
            ) : mode === 'globe' ? (
              <Globe
                ref={globeRef}
                globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
                bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
                backgroundColor="rgba(0,0,0,0)"
                width={window.innerWidth}
                height={window.innerHeight * 0.6}
                onGlobeClick={handleGlobeClick}
              />
            ) : (
              <MapComponent
                memories={memories}
                onMapClick={(lat, lng) => handleGlobeClick({ lat, lng })}
              />
            )}
          </div>
        </div>
      </div>

      {/* Memory Popup */}
      {selectedMemory && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 w-[90vw] max-w-md bg-white rounded-xl shadow-2xl border p-4 z-50">
          <h2 className="text-lg font-bold text-pink-600 mb-1">{selectedMemory.title}</h2>
          <p className="text-sm text-gray-600">
          Shared by <span className="font-semibold">{selectedMemory.user.name}</span></p>
          <p className="text-sm text-gray-600 mb-1">{selectedMemory.location}</p>
          <p className="text-xs text-gray-400 mb-2">
            {format(new Date(selectedMemory.startDate), 'PPP')} -{' '}
            {format(new Date(selectedMemory.endDate), 'PPP')}
          </p>
          <p className="text-sm text-gray-800 mb-3 line-clamp-3">{selectedMemory.description}</p>
          <div className="flex gap-2 overflow-x-auto max-w-full">
            {selectedMemory.photos.map((url, idx) => (
              <Image
                key={idx}
                src={url}
                alt={`memory-${idx}`}
                width={120}
                height={80}
                className="rounded-md object-cover border shadow-sm cursor-pointer"
                unoptimized
                onClick={() => setLightboxIndex(idx)}
              />
            ))}
          </div>
          <button
            onClick={() => setSelectedMemory(null)}
            className="mt-4 text-xs text-pink-600 hover:underline"
          >
            Close
          </button>
        </div>
      )}

      {/* Lightbox for fullscreen image preview */}
      {selectedMemory && lightboxIndex >= 0 && (
        <Lightbox
          open
          index={lightboxIndex}
          close={() => setLightboxIndex(-1)}
          slides={selectedMemory.photos.map((url) => ({ src: url }))}
        />
      )}
    </div>
  )
}
