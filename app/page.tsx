'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Sparkles, MapPin, ShieldCheck } from 'lucide-react'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#fcc5c0] to-[#fa9fb5] text-pink-900 px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center justify-center">
      <section className="w-full max-w-6xl text-center">
        {/* Title */}
        <h1 className="text-xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight break-words">
          Welcome to{' '}
          <span
            className="text-pink-700 text-2xl sm:text-4xl md:text-5xl lg:text-6xl tracking-wide"
            style={{ fontFamily: 'vamos, sans-serif' }}
          >
            MEMORIES
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg lg:text-xl mb-10 max-w-3xl mx-auto px-2">
          Capture, store, and revisit your most cherished memories — safely and beautifully.
          Whether it&apos;s a road trip, a family gathering, or a quiet moment you never want to forget,
          Memory lets you keep it forever.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-4 mb-12 px-2">
          <Button
            asChild
            size="lg"
            className="bg-pink-600 hover:bg-pink-700 text-white w-full sm:w-auto"
          >
            <Link href="/memories/new">
              <Sparkles className="mr-2 h-5 w-5" />
              Create a Memory
            </Link>
          </Button>

          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-pink-600 text-pink-800 hover:bg-pink-200 w-full sm:w-auto"
          >
            <Link href="/memories">View Memories</Link>
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-2">
          {/* Feature 1 */}
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-xl transition-all text-left h-full">
            <Sparkles className="h-6 w-6 text-pink-500 mb-3" />
            <h3 className="font-semibold text-lg mb-2">Beautiful Memories</h3>
            <p className="text-sm text-pink-800 leading-relaxed">
              Upload photos, write about your journey, and store it with stunning layouts.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-xl transition-all text-left h-full">
            <MapPin className="h-6 w-6 text-pink-500 mb-3" />
            <h3 className="font-semibold text-lg mb-2">Location-Based</h3>
            <p className="text-sm text-pink-800 leading-relaxed">
              Tag memories with places on the map — see where each story unfolded.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-xl transition-all text-left h-full">
            <ShieldCheck className="h-6 w-6 text-pink-500 mb-3" />
            <h3 className="font-semibold text-lg mb-2">Public Globe</h3>
            <p className="text-sm text-pink-800 leading-relaxed">
              Explore real memories shared by people worldwide — feel their moments, stories, and places.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
