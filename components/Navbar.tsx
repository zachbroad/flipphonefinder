'use client'

import Link from "next/link"

interface NavbarProps {
  deviceCount?: number
  currentPage?: string
}

export default function Navbar({ deviceCount, currentPage }: NavbarProps) {
  return (
    <nav className="bg-white/95 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-50 mb-8">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-indigo-700 bg-clip-text text-transparent hover:from-indigo-700 hover:to-slate-800 transition-all duration-300">
              📱 FlipPhoneFinder
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-10">
            <Link
              href="/"
              className={`text-slate-600 hover:text-indigo-600 transition-all duration-200 font-medium tracking-wide relative group ${
                currentPage === 'browse' ? 'text-indigo-600' : ''
              }`}
            >
              Browse Phones
              <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full ${
                currentPage === 'browse' ? 'w-full' : ''
              }`}></span>
            </Link>
            <Link
              href="/compare"
              className={`text-slate-600 hover:text-indigo-600 transition-all duration-200 font-medium tracking-wide relative group ${
                currentPage === 'compare' ? 'text-indigo-600' : ''
              }`}
            >
              Compare
              <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full ${
                currentPage === 'compare' ? 'w-full' : ''
              }`}></span>
            </Link>
            <Link
              href="/guides"
              className={`text-slate-600 hover:text-indigo-600 transition-all duration-200 font-medium tracking-wide relative group ${
                currentPage === 'guides' ? 'text-indigo-600' : ''
              }`}
            >
              Buying Guides
              <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full ${
                currentPage === 'guides' ? 'w-full' : ''
              }`}></span>
            </Link>
            <Link
              href="/blog"
              className={`text-slate-600 hover:text-indigo-600 transition-all duration-200 font-medium tracking-wide relative group ${
                currentPage === 'blog' ? 'text-indigo-600' : ''
              }`}
            >
              Blog
              <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full ${
                currentPage === 'blog' ? 'w-full' : ''
              }`}></span>
            </Link>
            <Link
              href="/contact"
              className={`text-slate-600 hover:text-indigo-600 transition-all duration-200 font-medium tracking-wide relative group ${
                currentPage === 'contact' ? 'text-indigo-600' : ''
              }`}
            >
              Contact
              <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full ${
                currentPage === 'contact' ? 'w-full' : ''
              }`}></span>
            </Link>
          </div>
          {deviceCount && (
            <div className="flex items-center">
              <span className="text-sm text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full font-medium">
                {deviceCount} devices
              </span>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}