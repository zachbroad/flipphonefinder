'use client'

interface NavbarProps {
  deviceCount?: number
  currentPage?: string
}

export default function Navbar({ deviceCount, currentPage }: NavbarProps) {
  return (
    <nav className="bg-white/90 backdrop-blur-lg border-b border-white/20 sticky top-0 z-50 mb-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <a href="/" className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-indigo-900 bg-clip-text text-transparent">
              📱 FlipPhoneFinder
            </a>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a 
              href="/" 
              className={`text-slate-700 hover:text-indigo-600 transition-colors font-medium ${
                currentPage === 'browse' ? 'text-indigo-600' : ''
              }`}
            >
              Browse Phones
            </a>
            <a 
              href="/compare" 
              className={`text-slate-700 hover:text-indigo-600 transition-colors font-medium ${
                currentPage === 'compare' ? 'text-indigo-600' : ''
              }`}
            >
              Compare
            </a>
            <a 
              href="/guides" 
              className={`text-slate-700 hover:text-indigo-600 transition-colors font-medium ${
                currentPage === 'guides' ? 'text-indigo-600' : ''
              }`}
            >
              Buying Guides
            </a>
            <a 
              href="/blog" 
              className={`text-slate-700 hover:text-indigo-600 transition-colors font-medium ${
                currentPage === 'blog' ? 'text-indigo-600' : ''
              }`}
            >
              Blog
            </a>
            <a 
              href="/contact" 
              className={`text-slate-700 hover:text-indigo-600 transition-colors font-medium ${
                currentPage === 'contact' ? 'text-indigo-600' : ''
              }`}
            >
              Contact
            </a>
          </div>
          {deviceCount && (
            <div className="flex items-center space-x-4">
              <span className="text-sm text-slate-600">
                {deviceCount} devices
              </span>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}