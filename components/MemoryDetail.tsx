"use client"

import { Memory, Photo } from "@prisma/client"
import { Calendar, MapPin, NotepadText } from "lucide-react"
import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { useState } from "react"
import Map from '@/components/map'
import Lightbox from "yet-another-react-lightbox"
import "yet-another-react-lightbox/styles.css"
interface MemoryDetailClientProps {
  memory: Memory & {
    photos: Photo[]
  }
}

export default function MemoryDetailClient({ memory }: MemoryDetailClientProps) {
  const coverImage = memory.photos?.[0].imageUrl
  const [activeTab, setActiveTab] = useState('overview')
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const allImages = memory.photos.map(photo => photo.imageUrl)

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {coverImage && (
        <div
          className="relative bg-[#fa9fb5] w-full h-72 md:h-96 rounded-lg overflow-hidden shadow-xl cursor-pointer"
          onClick={() => {
            setLightboxIndex(0)
            setLightboxOpen(true)
          }}
        >
          <Image
            src={coverImage}
            alt={memory.title}
            className="object-cover"
            fill
            priority
          />
        </div>
      )}

      <div className="bg-[#fa9fb5] p-6 shadow rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-4xl font-extrabold text-[#7a0177]">{memory.title}</h1>
          <div className="flex items-center text-[#6b0169] mt-2">
            <Calendar className="h-5 w-5 mr-2" />
            <span className="text-lg">
              {memory.startDate.toLocaleDateString()} - {memory.endDate.toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-pink-300 p-6 shadow rounded-lg">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
            <TabsTrigger value="map">Map</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-x-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-2xl font-semibold mb-4">Memory Summary</h2>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Calendar className="h-6 w-6 mr-3" />
                    <div>
                      <p className="text-[19px]">Dates</p>
                      <p className="text-sm">
                        {memory.startDate.toLocaleDateString()} - {memory.endDate.toLocaleDateString()}
                        <br />
                        {Math.round((memory.endDate.getTime() - memory.startDate.getTime()) / (1000 * 60 * 60 * 24))} day(s)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start mt-4">
                    <MapPin className="h-6 w-6 mr-3" />
                    <div>
                      <p className="text-[19px]">Destination</p>
                      <p>{memory.location}</p>
                    </div>
                  </div>

                  <div className="flex items-start mt-4">
                    <NotepadText className="h-6 w-6 mr-3" />
                    <div>
                      <p className="text-[19px]">Description</p>
                      <p className="text-sm">{memory.description}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="h-72 rounded-lg mt-5 overflow-hidden">
                {memory.latitude && memory.longitude ? (
                  <Map location={{ lat: memory.latitude, lng: memory.longitude, title: memory.title }} />
                ) : (
                  <span className="ml-2 text-lg rounded-lg bg-pink-200 px-3 py-2">
                    No location set for this memory.
                  </span>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="images">
            <div className="grid md:grid-cols-4 gap-6">
              {memory.photos.map((img, idx) => (
                <div
                  key={idx}
                  className="relative w-full h-64 rounded overflow-hidden cursor-pointer"
                  onClick={() => {
                    setLightboxIndex(idx)
                    setLightboxOpen(true)
                  }}
                >
                  <Image
                    src={img.imageUrl}
                    alt={`memory-photo-${idx}`}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="map">
            <div className="h-72 rounded-lg mt-5 overflow-hidden">
                {memory.latitude && memory.longitude ? (
                  <Map location={{ lat: memory.latitude, lng: memory.longitude, title: memory.title }} />
                ) : (
                  <span className="ml-2 text-lg rounded-lg bg-pink-200 px-3 py-2">
                    No location set for this memory.
                  </span>
                )}
              </div>
          </TabsContent>
        </Tabs>
      </div>

      {lightboxOpen && (
        <Lightbox
          open={lightboxOpen}
          close={() => setLightboxOpen(false)}
          slides={allImages.map((src) => ({ src }))}
          index={lightboxIndex}
          on={{ view: ({ index }) => setLightboxIndex(index) }}
        />
      )}
    </div>
  )
}
