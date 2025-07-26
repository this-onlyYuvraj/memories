'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { login, logout } from '@/lib/auth-actions'
import { Session } from 'next-auth'
import { CircleUserRound, Menu, X } from 'lucide-react'
import { usePathname } from 'next/navigation'

export default function Navbar({ session }: { session: Session | null }) {
  const [open, setOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  return (
    <nav className="bg-[#f768a1] shadow-md border-b">
      <div className="container mx-auto flex items-center justify-between px-4 py-4 lg:px-8">
        {/* Brand */}
        <Link href="/" className="flex items-center space-x-2">
          <span
          className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-pink-100 font-bold tracking-wide"
          style={{ fontFamily: 'vamos, sans-serif' }}
        >
          MEMORIES
        </span>
        </Link>

        {/* Mobile Toggle */}
        <button
          className="lg:hidden text-white focus:outline-none"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center space-x-8 text-white">
          <Link href="/" className="hover:text-[#7a0177] transition">Home</Link>
          <Link href="/globe" className="hover:text-[#7a0177] transition">Globe</Link>
          <Link href="/memories" className="hover:text-[#7a0177] transition">Memories</Link>
          <Link href="/public-globe" className="hover:text-[#7a0177] transition">Public Globe</Link>

          {session ? (
            <div className="relative" ref={dropdownRef}>
              {session.user?.image ? (
                <Image
                  src={session.user.image}
                  alt="User"
                  width={32}
                  height={32}
                  className="cursor-pointer rounded-full"
                  onClick={() => setOpen((prev) => !prev)}
                />
              ) : (
                <CircleUserRound
                  className="cursor-pointer"
                  size={32}
                  onClick={() => setOpen((prev) => !prev)}
                />
              )}

              {open && (
                <div className="absolute top-11 -right-2 w-36 bg-pink-600 text-white rounded-md shadow-lg z-50">
                  <button
                    onClick={logout}
                    className="w-full px-4 py-2 text-sm hover:bg-pink-700 rounded-md transition"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={login}
              className="py-1.5 px-4 bg-pink-600 hover:bg-pink-700 rounded-full transition"
            >
              Sign In
            </button>
          )}
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-[#f768a1] px-4 pb-4 space-y-2 text-white">
          <Link href="/" className="block hover:text-[#7a0177] transition">
            Home
          </Link>
          <Link href="/globe" className="block hover:text-[#7a0177] transition">
            Globe
          </Link>
          <Link href="/memories" className="block hover:text-[#7a0177] transition">
            Memories
          </Link>
          <Link href="/public-globe" className="block hover:text-[#7a0177] transition">
            Public Globe
          </Link>

          {session ? (
            <button
              onClick={logout}
              className="w-full mt-2 px-4 py-2 bg-pink-600 hover:bg-pink-700 rounded-full text-white transition"
            >
              Sign Out
            </button>
          ) : (
            <button
              onClick={login}
              className="w-full mt-2 px-4 py-2 bg-pink-600 hover:bg-pink-700 rounded-full text-white transition"
            >
              Sign In
            </button>
          )}
        </div>
      )}
    </nav>
  )
}
