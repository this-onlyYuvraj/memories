'use client'

import { useState, useTransition, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import LocationInput from '@/components/add-Location'
import { createMemory } from '@/lib/actions/create-memory'
import ImageUploader from '@/components/imageUploader'
import { Switch } from '@/components/ui/switch'

export default function NewMemoryForm() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isPending, startTransition] = useTransition()
  const [showDialog, setShowDialog] = useState(false)
  const [form, setForm] = useState({
    title: '',
    description: '',
    location: { lat: 0, lng: 0, address: '' },
    startDate: '',
    endDate:'',
    isPublic: false,
    images: [] as { url: string; publicId: string }[],
  })

  const today = new Date().toISOString().split('T')[0]

  const hasChanges =
    form.title ||
    form.description ||
    form.location.address ||
    form.startDate ||
    form.endDate ||
    form.images.length > 0

  const handleNext = () => setStep(2)

 const handleSubmit = () => {
  const formData = new FormData()
  formData.append('title', form.title)
  formData.append('description', form.description)
  formData.append('location', form.location.address)
  formData.append('latitude', String(form.location.lat))
  formData.append('longitude', String(form.location.lng))
  formData.append('startDate', form.startDate)
  formData.append('endDate',form.endDate)
  formData.append('isPublic', form.isPublic ? 'true' : 'false')
    form.images.forEach((img) => {
      formData.append('images', JSON.stringify(img))
    })
    startTransition(() => {
      createMemory(formData)
    })
}

  const handleDiscard = async () => {
    setShowDialog(false)

    const publicIds = form.images.map((img) => img.publicId)

    if (publicIds.length > 0) {
      try {
        await fetch('/api/delete-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ publicIds }),
        })
      } catch (err) {
        console.error('Failed to delete images from Cloudinary')
      }
    }

    window.removeEventListener('popstate', handlePopState)
    router.push('/memories')
  }

  const handlePopState = useCallback((e: PopStateEvent) => {
    if (step === 1 && hasChanges) {
      e.preventDefault()
      setShowDialog(true)
      window.history.pushState(null, '', window.location.href)
    } else if (step === 1 && !hasChanges) {
      router.push('/memories')
    }
  }, [step, hasChanges])

  useEffect(() => {
    window.history.pushState(null, '', window.location.href)
    window.addEventListener('popstate', handlePopState)

    const beforeUnloadHandler = (e: BeforeUnloadEvent) => {
      if (hasChanges && form.images.length > 0) {
        navigator.sendBeacon(
          '/api/delete-image',
          JSON.stringify({ publicIds: form.images.map((img) => img.publicId) })
        )
      }
      e.preventDefault()
      e.returnValue = ''
      return ''
    }

    window.addEventListener('beforeunload', beforeUnloadHandler)

    return () => {
      window.removeEventListener('popstate', handlePopState)
      window.removeEventListener('beforeunload', beforeUnloadHandler)
    }
  }, [hasChanges, form.images, handlePopState])

  return (
    <div className="max-w-lg mx-auto mt-10">
      <Card className="bg-[var(--pink)]">
        <CardHeader className="text-white">
          {step === 1 ? 'New Memory' : 'Upload Photos'}
        </CardHeader>

        <CardContent>
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-lg font-medium text-pink-100 mb-1">Title</label>
                <input
                  type="text"
                  id="title"
                  className={cn('w-full border text-pink-900 border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500')}
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-lg font-medium text-pink-100 mb-1">Description</label>
                <textarea
                  id="description"
                  className={cn('w-full border text-pink-900 border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500')}
                  required
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-lg font-medium text-pink-100 mb-1">Location</label>
                <LocationInput
                  onLocationSelect={(loc) => setForm({ ...form, location: loc })}
                  value={form.location.address}
                />
              </div>
              <div className='grid grid-cols-2 gap-2'>
                <div className='w-full'>
                <label htmlFor="date" className="block text-lg font-medium text-pink-100 mb-1">Start Date</label>
                <input
                  type="date"
                  id="startDate"
                  max={today}
                  className={cn('w-full border text-pink-900 border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500')}
                  required
                  value={form.startDate}
                  onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                />
              </div>
              <div className='w-full'>
                <label htmlFor="date" className="block text-lg font-medium text-pink-100 mb-1">End Date</label>
                <input
                  type="date"
                  id="endDate"
                  max={today}
                  className={cn('w-full border text-pink-900 border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500')}
                  required
                  value={form.endDate}
                  onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                />
              </div>
              </div>
              

              <div className="flex items-center space-x-3">
                <label htmlFor="isPublic" className="text-lg font-medium text-pink-100">Make Public</label>
                <Switch
                  id="isPublic"
                  checked={form.isPublic}
                  onCheckedChange={(val) => setForm((prev) => ({ ...prev, isPublic: val }))}
                  className={cn(
                    'relative inline-flex h-6 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out',
                    'data-[state=checked]:bg-pink-600',
                    'data-[state=unchecked]:bg-pink-100',
                    '[&_[data-state=unchecked]]:bg-pink-600'
                  )}
                />
              </div>

              <div className="flex justify-between">
                <Button variant="outline" type="button" onClick={() => window.history.back()}>
                  Back
                </Button>
                <Button type="button" className='bg-pink-600 hover:bg-pink-700 text-white' onClick={handleNext}>
                  Next
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <ImageUploader
                images={form.images}
                setImages={(urls) => setForm({ ...form, images: urls })}
              />
              <div className="flex justify-between">
                <Button variant="outline" type="button" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button className='bg-pink-600 hover:bg-pink-700 text-white' type="button" onClick={handleSubmit} disabled={isPending}>
                  {isPending ? 'Creating...' : 'Create Memory'}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Discard Memory?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600">
            If you go back, you'll lose the memory you have made.
          </p>
          <DialogFooter className="flex justify-end gap-2 mt-4">
            <Button variant="ghost" onClick={() => setShowDialog(false)}>
              Keep Making
            </Button>
            <Button variant="destructive" onClick={handleDiscard}>
              Discard
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
