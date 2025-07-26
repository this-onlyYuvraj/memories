'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { CldUploadWidget, CloudinaryUploadWidgetResults } from 'next-cloudinary'

interface Image {
  url: string
  publicId: string
}

interface Props {
  images: Image[]
  setImages: (images: Image[]) => void
}

export default function ImageUploader({ images, setImages }: Props) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  const handleUpload = (result: CloudinaryUploadWidgetResults) => {
    let newImages: Image[] = []

    if (result.info && Array.isArray((result.info as any).files)) {
      newImages = (result.info as any).files.map((f: any) => ({
        url: f.uploadInfo?.secure_url,
        publicId: f.uploadInfo?.public_id,
      }))
    } else if ((result.info as any)?.secure_url) {
      newImages = [{
        url: (result.info as any).secure_url,
        publicId: (result.info as any).public_id,
      }]
    }

    setImages([...images, ...newImages])
  }

  const handleDelete = async (publicId: string) => {
    console.log('Deleting image:', publicId)
    setIsDeleting(publicId)
    try {
      await fetch('/api/delete-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publicIds: [publicId] }),
      })
      setImages(images.filter((img) => img.publicId !== publicId))
    } catch (err) {
      console.error('Failed to delete image from Cloudinary', err)
    } finally {
      setIsDeleting(null)
    }
  }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor)
  )

  const handleDragEnd = (event: any) => {
    const { active, over } = event
    if (active.id !== over?.id) {
      const oldIndex = images.findIndex((i) => i.publicId === active.id)
      const newIndex = images.findIndex((i) => i.publicId === over?.id)
      setImages(arrayMove(images, oldIndex, newIndex))
    }
  }

  return (
    <div className="space-y-4">
      <CldUploadWidget
        uploadPreset="preset_1"
        options={{ multiple: true }}
        onQueuesEnd={handleUpload}
      >
        {({ open }) => (
          <button
            type="button"
            onClick={() => open?.()}
            className="bg-pink-600 hover:bg-pink-700 text-white px-3 py-2 rounded-xl"
          >
            Upload Images
          </button>
        )}
      </CldUploadWidget>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={images.map((i) => i.publicId)}
          strategy={rectSortingStrategy}
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {images.map((img) => (
              <SortableImageItem
                key={img.publicId}
                image={img}
                isDeleting={isDeleting}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  )
}

function SortableImageItem({
  image,
  isDeleting,
  onDelete,
}: {
  image: Image
  isDeleting: string | null
  onDelete: (id: string) => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: image.publicId })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative rounded overflow-hidden"
    >
      <div
        className="cursor-grab active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <img
          src={image.url}
          alt="Uploaded"
          className="object-cover w-full h-32 sm:h-36 md:h-40 rounded"
        />
      </div>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          onDelete(image.publicId)
        }}
        disabled={isDeleting === image.publicId}
        className="absolute top-1 right-1 bg-black/60 text-white p-1 rounded-full hover:bg-black transition-opacity z-10"
      >
        <X size={13} />
      </button>
    </div>
  )
}
