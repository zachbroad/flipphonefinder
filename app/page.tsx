'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface Phone {
  id: string
  brand: string | null
  name: string | null
  description: string | null
  featured: boolean | null
  link: string | null
  shape: string | null
  price: string | null
  rating: number | null
  condition: string | null
  image: string | null
}

type SortField = 'brand' | 'name' | 'price' | 'condition'
type SortDirection = 'asc' | 'desc'

export default function Home() {
  const router = useRouter()
  const [phones, setPhones] = useState<Phone[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [sortField, setSortField] = useState<SortField>('name')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')
  const [conditionFilter, setConditionFilter] = useState<string>('all')
  const [priceRangeFilter, setPriceRangeFilter] = useState<string>('all')
  const [ratingFilter, setRatingFilter] = useState<string>('all')
  const [shapeFilter, setShapeFilter] = useState<string>('all')

  useEffect(() => {
    const fetchPhones = async () => {
      try {
        const response = await fetch('/api/phones')
        const data = await response.json()
        setPhones(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error('Error fetching phones:', error)
        setPhones([])
      } finally {
        setLoading(false)
      }
    }

    fetchPhones()
  }, [])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const filteredAndSortedPhones = phones
    .filter(phone => {
      const matchesSearch = !searchTerm ||
        phone.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        phone.name?.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesCondition = conditionFilter === 'all' || phone.condition === conditionFilter

      const matchesPrice = priceRangeFilter === 'all' || (() => {
        if (!phone.price) return priceRangeFilter === 'unknown'
        const price = parseFloat(phone.price)
        if (isNaN(price)) return priceRangeFilter === 'unknown'
        switch (priceRangeFilter) {
          case 'under-50': return price < 50
          case 'under-100': return price < 100
          case '100-250': return price >= 100 && price <= 250
          case '250-plus': return price > 250
          default: return true
        }
      })()

      const matchesRating = ratingFilter === 'all' || (() => {
        if (!phone.rating) return false
        const rating = phone.rating
        switch (ratingFilter) {
          case '3-plus': return rating >= 3
          case '4-plus': return rating >= 4
          case '5-star': return rating >= 5
          default: return true
        }
      })()

      const matchesShape = shapeFilter === 'all' || (() => {
        if (!phone.shape) return false
        // Handle jsonb data for filtering
        let shape = phone.shape
        if (typeof shape === 'object' && shape !== null) {
          if (Array.isArray(shape)) {
            shape = shape.join(' ') as string
          } else {
            shape = JSON.stringify(shape)
          }
        }
        const shapeStr = String(shape).toLowerCase().replace(/['"\[\]{}]/g, '').trim()
        return shapeStr.includes(shapeFilter.toLowerCase())
      })()

      return matchesSearch && matchesCondition && matchesPrice && matchesRating && matchesShape
    })
    .sort((a, b) => {
      // First sort by featured status (featured items first)
      if (a.featured !== b.featured) {
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
      }

      // Then sort by the selected field
      let aValue: string | number | null = a[sortField]
      let bValue: string | number | null = b[sortField]

      if (sortField === 'price') {
        aValue = parseFloat(a.price || '0') || 0
        bValue = parseFloat(b.price || '0') || 0
        if (typeof aValue !== 'number' || typeof bValue !== 'number') {
          return 0
        }
      }

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase()
        bValue = bValue?.toLowerCase() ?? ''
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
      return 0
    })

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return (
      <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
      </svg>
    )
    return sortDirection === 'asc' ? (
      <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    ) : (
      <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    )
  }

  const uniqueConditions = [...new Set(phones.map(phone => phone.condition).filter(Boolean))]

  const uniqueShapes = [...new Set(phones.map(phone => {
    if (!phone.shape) return null
    // Handle jsonb data - could be string, array, or object
    let shape = phone.shape
    if (typeof shape === 'object' && shape !== null) {
      if (Array.isArray(shape)) {
        shape = shape.join(' ') as string
      } else {
        shape = JSON.stringify(shape)
      }
    }
    return String(shape).toLowerCase().replace(/['"\[\]{}]/g, '').trim()
  }).filter(Boolean))]

  const handlePhoneClick = (phoneId: string) => {
    router.push(`/phones/${phoneId}`)
  }

  const clearAllFilters = () => {
    setSearchTerm('')
    setConditionFilter('all')
    setPriceRangeFilter('all')
    setRatingFilter('all')
    setShapeFilter('all')
  }

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)

    return (
      <span className="flex items-center">
        {/* Full stars */}
        {Array.from({ length: fullStars }).map((_, i) => (
          <span key={`full-${i}`} className="text-amber-400">⭐</span>
        ))}

        {/* Half star */}
        {hasHalfStar && (
          <span className="relative">
            <span className="text-gray-300">☆</span>
            <span className="absolute inset-0 text-amber-400 overflow-hidden" style={{ width: '50%' }}>
              ⭐
            </span>
          </span>
        )}

        {/* Empty stars */}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <span key={`empty-${i}`} className="text-gray-300">☆</span>
        ))}
      </span>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-800 mb-2">
            Find Your Perfect Digital Wellness Device
          </h2>
          <p className="text-lg text-slate-600">
            Compare flip phones, dumbphones, and minimalist devices designed for mindful living
          </p>
        </div>

        {/* Getting Started Section */}
        <div className="mb-8">
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-slate-800 mb-2">🚀 Getting Started</h3>
              <p className="text-slate-600 text-sm">New to flip phones? Start with these essential guides</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a href="/guides/buyers-guide" className="group bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 hover:shadow-lg transition-all duration-200">
                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-200">📘</div>
                <h4 className="text-base font-bold text-slate-800 mb-2 group-hover:text-indigo-700 transition-colors">{`Complete Buyer's Guide`}</h4>
                <p className="text-slate-600 text-xs mb-2">Everything you need to know before buying your first flip phone</p>
                <div className="flex items-center text-xs text-slate-500">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full mr-2">Beginner</span>
                  <span>15 min read</span>
                </div>
              </a>

              <a href="/guides/digital-detox" className="group bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200 rounded-xl p-4 hover:shadow-lg transition-all duration-200">
                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-200">🧘</div>
                <h4 className="text-base font-bold text-slate-800 mb-2 group-hover:text-emerald-700 transition-colors">Digital Detox Guide</h4>
                <p className="text-slate-600 text-xs mb-2">Step-by-step plan to reduce screen time and digital dependency</p>
                <div className="flex items-center text-xs text-slate-500">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full mr-2">Beginner</span>
                  <span>12 min read</span>
                </div>
              </a>

              <a href="/guides/switching-guide" className="group bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4 hover:shadow-lg transition-all duration-200">
                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-200">🔄</div>
                <h4 className="text-base font-bold text-slate-800 mb-2 group-hover:text-purple-700 transition-colors">Switching Made Easy</h4>
                <p className="text-slate-600 text-xs mb-2">Practical tips for transitioning from smartphone to flip phone</p>
                <div className="flex items-center text-xs text-slate-500">
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full mr-2">Intermediate</span>
                  <span>10 min read</span>
                </div>
              </a>
            </div>

            <div className="text-center mt-6">
              <a href="/guides" className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 text-sm">
                View All Guides
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search flip phones, dumbphones, and digital wellness devices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-6 py-4 text-lg bg-white/90 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 text-slate-900 placeholder-slate-500 shadow-lg"
              />
              <div className="absolute right-5 top-4">
                <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3 justify-center">
            {/* Popular Feature Pills */}
            <div className="flex flex-wrap gap-2">
              <button className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 bg-white/80 text-slate-700 hover:bg-white border border-slate-200 hover:shadow-md">
                📱 Flip Phones
              </button>
              <button className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 bg-white/80 text-slate-700 hover:bg-white border border-slate-200 hover:shadow-md">
                🔋 Long Battery
              </button>
              <button className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 bg-white/80 text-slate-700 hover:bg-white border border-slate-200 hover:shadow-md">
                📞 VoLTE Support
              </button>
              <button className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 bg-white/80 text-slate-700 hover:bg-white border border-slate-200 hover:shadow-md">
                📶 WiFi Calling
              </button>
              <button className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 bg-white/80 text-slate-700 hover:bg-white border border-slate-200 hover:shadow-md">
                📷 With Camera
              </button>
              <button className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 bg-white/80 text-slate-700 hover:bg-white border border-slate-200 hover:shadow-md">
                🔓 Unlocked
              </button>
            </div>

            {/* Condition Pills */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setConditionFilter('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${conditionFilter === 'all'
                  ? 'bg-gradient-to-r from-slate-600 to-slate-700 text-white shadow-lg'
                  : 'bg-white/80 text-slate-700 hover:bg-white border border-slate-200 hover:shadow-md'
                  }`}
              >
                All Conditions
              </button>
              {uniqueConditions.map(condition => (
                <button
                  key={condition}
                  onClick={() => setConditionFilter(condition || '')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${conditionFilter === condition
                    ? condition === 'New'
                      ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg'
                      : condition === 'Refurbished'
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
                        : 'bg-gradient-to-r from-slate-500 to-slate-600 text-white shadow-lg'
                    : 'bg-white/80 text-slate-700 hover:bg-white border border-slate-200 hover:shadow-md'
                    }`}
                >
                  ⚡ {condition}
                </button>
              ))}
            </div>

            {/* Price Range Pills */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setPriceRangeFilter('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${priceRangeFilter === 'all'
                  ? 'bg-gradient-to-r from-slate-600 to-slate-700 text-white shadow-lg'
                  : 'bg-white/80 text-slate-700 hover:bg-white border border-slate-200 hover:shadow-md'
                  }`}
              >
                All Prices
              </button>
              {[
                { value: 'under-50', label: '💰 Under $50' },
                { value: 'under-100', label: '💰 Under $100' },
                { value: '100-250', label: '💰 $100-$250' },
                { value: '250-plus', label: '💰 $250+' },
              ].map(price => (
                <button
                  key={price.value}
                  onClick={() => setPriceRangeFilter(price.value)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${priceRangeFilter === price.value
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                    : 'bg-white/80 text-slate-700 hover:bg-white border border-slate-200 hover:shadow-md'
                    }`}
                >
                  {price.label}
                </button>
              ))}
            </div>

            {/* Rating Pills */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setRatingFilter('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${ratingFilter === 'all'
                  ? 'bg-gradient-to-r from-slate-600 to-slate-700 text-white shadow-lg'
                  : 'bg-white/80 text-slate-700 hover:bg-white border border-slate-200 hover:shadow-md'
                  }`}
              >
                All Ratings
              </button>
              {[
                { value: '3-plus', label: '⭐ 3+ Stars' },
                { value: '4-plus', label: '⭐ 4+ Stars' },
                { value: '5-star', label: '⭐ 5 Stars' },
              ].map(rating => (
                <button
                  key={rating.value}
                  onClick={() => setRatingFilter(rating.value)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${ratingFilter === rating.value
                    ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg'
                    : 'bg-white/80 text-slate-700 hover:bg-white border border-slate-200 hover:shadow-md'
                    }`}
                >
                  {rating.label}
                </button>
              ))}
            </div>

            {/* Shape/Form Factor Pills */}
            {uniqueShapes.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setShapeFilter('all')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${shapeFilter === 'all'
                    ? 'bg-gradient-to-r from-slate-600 to-slate-700 text-white shadow-lg'
                    : 'bg-white/80 text-slate-700 hover:bg-white border border-slate-200 hover:shadow-md'
                    }`}
                >
                  All Shapes
                </button>
                {uniqueShapes.map(shape => shape && (
                  <button
                    key={shape}
                    onClick={() => setShapeFilter(shape)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${shapeFilter === shape
                      ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg'
                      : 'bg-white/80 text-slate-700 hover:bg-white border border-slate-200 hover:shadow-md'
                      }`}
                  >
                    📱 {shape.charAt(0).toUpperCase() + shape.slice(1)}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Active Filters Summary */}
          {(searchTerm || conditionFilter !== 'all' || priceRangeFilter !== 'all' || ratingFilter !== 'all' || shapeFilter !== 'all') && (
            <div className="mt-4 text-center">
              <div className="inline-flex items-center px-4 py-2 bg-white/80 rounded-xl border border-slate-200">
                <span className="text-sm text-slate-600 mr-3">Active filters:</span>
                <div className="flex flex-wrap gap-2">
                  {searchTerm && (
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-blue-100 text-blue-800">
                      {`"${searchTerm}"`}
                      <button
                        onClick={() => setSearchTerm('')}
                        className="ml-1 text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  {conditionFilter !== 'all' && (
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-emerald-100 text-emerald-800">
                      {conditionFilter}
                      <button
                        onClick={() => setConditionFilter('all')}
                        className="ml-1 text-emerald-600 hover:text-emerald-800"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  {priceRangeFilter !== 'all' && (
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-purple-100 text-purple-800">
                      {priceRangeFilter.replace('-', '-$').replace('under', 'Under $').replace('over', 'Over $')}
                      <button
                        onClick={() => setPriceRangeFilter('all')}
                        className="ml-1 text-purple-600 hover:text-purple-800"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  {ratingFilter !== 'all' && (
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-amber-100 text-amber-800">
                      {ratingFilter === '3-plus' ? '3+ Stars' : ratingFilter === '4-plus' ? '4+ Stars' : '5 Stars'}
                      <button
                        onClick={() => setRatingFilter('all')}
                        className="ml-1 text-amber-600 hover:text-amber-800"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  {shapeFilter !== 'all' && (
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-pink-100 text-pink-800">
                      {shapeFilter.charAt(0).toUpperCase() + shapeFilter.slice(1)}
                      <button
                        onClick={() => setShapeFilter('all')}
                        className="ml-1 text-pink-600 hover:text-pink-800"
                      >
                        ×
                      </button>
                    </span>
                  )}
                </div>
                <button
                  onClick={clearAllFilters}
                  className="ml-3 text-xs text-slate-500 hover:text-slate-700 underline"
                >
                  Clear all
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white/60 backdrop-blur-sm rounded-xl px-4 sm:px-6 py-4 border border-white/30 gap-3 sm:gap-0">
            <p className="text-slate-700 font-medium text-sm sm:text-base">
              Showing <span className="font-bold text-indigo-600">{filteredAndSortedPhones.length}</span> of <span className="font-bold">{phones.length}</span> phones
            </p>
            <div className="flex items-center text-xs sm:text-sm text-slate-500 justify-center sm:justify-start">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              Table View
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-32">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600"></div>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-400 to-purple-500 opacity-20 animate-pulse"></div>
            </div>
          </div>
        ) : (
          /* Modern Table */
          <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/30 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-slate-100 to-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-8 py-5 text-left">
                      <button
                        onClick={() => handleSort('brand')}
                        className="flex items-center space-x-2 text-sm font-bold text-slate-800 hover:text-indigo-600 transition-colors duration-200 group"
                      >
                        <span>Brand</span>
                        <div className="group-hover:scale-110 transition-transform duration-200">
                          {getSortIcon('brand')}
                        </div>
                      </button>
                    </th>
                    <th className="px-8 py-5 text-left">
                      <button
                        onClick={() => handleSort('name')}
                        className="flex items-center space-x-2 text-sm font-bold text-slate-800 hover:text-indigo-600 transition-colors duration-200 group"
                      >
                        <span>Name</span>
                        <div className="group-hover:scale-110 transition-transform duration-200">
                          {getSortIcon('name')}
                        </div>
                      </button>
                    </th>
                    <th className="px-8 py-5 text-left">
                      <button
                        onClick={() => handleSort('price')}
                        className="flex items-center space-x-2 text-sm font-bold text-slate-800 hover:text-indigo-600 transition-colors duration-200 group"
                      >
                        <span>Price</span>
                        <div className="group-hover:scale-110 transition-transform duration-200">
                          {getSortIcon('price')}
                        </div>
                      </button>
                    </th>
                    <th className="px-8 py-5 text-left text-sm font-bold text-slate-800">
                      Image
                    </th>
                    <th className="px-8 py-5 text-left text-sm font-bold text-slate-800">
                      Rating
                    </th>
                    <th className="px-8 py-5 text-left text-sm font-bold text-slate-800">
                      Description
                    </th>
                    <th className="px-8 py-5 text-left text-sm font-bold text-slate-800">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredAndSortedPhones.map((phone) => (
                    <tr
                      key={phone.id}
                      onClick={() => handlePhoneClick(phone.id.toString())}
                      className={`hover:bg-gradient-to-r hover:from-indigo-50 hover:to-blue-50 transition-all duration-200 group cursor-pointer ${phone.featured ? 'bg-gradient-to-r from-amber-50 to-yellow-50 border-l-4 border-amber-400' : ''
                        }`}
                    >
                      <td className="px-8 py-6">
                        <div className="font-bold text-slate-900 group-hover:text-indigo-700 transition-colors duration-200 flex items-center">
                          {phone.brand || 'Unknown'}
                          {phone.featured && (
                            <span className="ml-2 text-amber-500" title="Featured Phone">
                              ⭐
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="text-slate-800 font-medium">{phone.name || 'Unknown'}</div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="font-bold text-emerald-600 text-lg">
                          {phone.price ? `$${parseFloat(phone.price).toLocaleString()}` : (
                            <span className="text-slate-400 text-sm font-normal">N/A</span>
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="h-20 w-20 relative group-hover:scale-110 transition-transform duration-200">
                          {phone.image ? (
                            <Image
                              src={phone.image}
                              alt={`${phone.brand} ${phone.name}`}
                              fill
                              className="object-cover rounded-xl shadow-lg border-2 border-white"
                            />
                          ) : (
                            <div className="h-20 w-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center shadow-lg border-2 border-white">
                              <span className="text-3xl filter grayscale">📱</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="text-lg">
                          {phone.rating ? (
                            <span className="text-amber-400">{renderStars(phone.rating)}</span>
                          ) : (
                            <span className="text-slate-400 text-sm">No rating</span>
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="text-sm text-slate-600 max-w-xs leading-relaxed">
                          {phone.description ? (
                            <span className="text-slate-700">{phone.description}</span>
                          ) : (
                            <span className="italic text-slate-400">No description available</span>
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handlePhoneClick(phone.id.toString())
                            }}
                            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-semibold rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg group-hover:scale-105"
                          >
                            View Details
                            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                          {phone.link && (
                            <a
                              href={phone.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white text-sm font-semibold rounded-lg hover:from-emerald-600 hover:to-green-700 transition-all duration-200 shadow-md hover:shadow-lg group-hover:scale-105"
                            >
                              🛒 Buy Now
                              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-1M14 6a2 2 0 002 2v1m-6 8a2 2 0 002-2v-1" />
                              </svg>
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {!loading && filteredAndSortedPhones.length === 0 && (
          <div className="text-center py-32">
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-12 max-w-md mx-auto">
              <div className="text-8xl mb-6 filter grayscale opacity-60">🔍</div>
              <h3 className="text-3xl font-bold text-slate-800 mb-4">No devices found</h3>
              <p className="text-slate-600 leading-relaxed">Try adjusting your search terms or filters to discover more digital wellness devices</p>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-20 bg-white/90 backdrop-blur-lg border-t border-white/20">
          <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Company Info */}
              <div className="md:col-span-2">
                <h3 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-indigo-900 bg-clip-text text-transparent mb-4">
                  📱 FlipPhoneFinder
                </h3>
                <p className="text-slate-600 mb-4 leading-relaxed">
                  Your trusted source for discovering the best flip phones and digital wellness devices. Curated to help you find the perfect balance between connectivity and mindful technology use.
                </p>
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 border border-indigo-100">
                  <p className="text-sm font-semibold text-slate-800 mb-1">Powered by</p>
                  <p className="text-lg font-bold text-indigo-700">Broad Publications LLC</p>
                  <p className="text-sm text-slate-600">Digital Wellness & Technology Curation</p>
                </div>
              </div>

              {/* Contact Info */}
              <div>
                <h4 className="text-lg font-bold text-slate-800 mb-4">Contact Us</h4>
                <div className="space-y-3 text-sm text-slate-600">
                  <div className="flex items-start space-x-3">
                    <svg className="w-4 h-4 mt-1 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div>
                      <p className="font-medium">Broad Publications LLC</p>
                      <p>201 N US Highway 1</p>
                      <p>STE D10 #1129</p>
                      <p>Jupiter, FL 33477</p>
                      <p>United States</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <p>hello@broadpublications.com</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <p>(555) 123-4567</p>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="text-lg font-bold text-slate-800 mb-4">Resources</h4>
                <div className="space-y-2 text-sm">
                  <Link href="/guides" className="block text-slate-600 hover:text-indigo-600 transition-colors">Digital Wellness Guide</Link>
                  <Link href="/compare" className="block text-slate-600 hover:text-indigo-600 transition-colors">Phone Comparison Tool</Link>
                  <Link href="/guides/buyers-guide" className="block text-slate-600 hover:text-indigo-600 transition-colors">{`Buyer's Guide`}</Link>
                  <Link href="/blog" className="block text-slate-600 hover:text-indigo-600 transition-colors">{`Blog & Reviews`}</Link>
                  <Link href="/contact" className="block text-slate-600 hover:text-indigo-600 transition-colors">Support Center</Link>
                </div>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-slate-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-slate-600 mb-4 md:mb-0">
                © {new Date().getFullYear()} Broad Publications LLC. All rights reserved. |
                <a href="/privacy" className="ml-1 hover:text-indigo-600 transition-colors">Privacy Policy</a> |
                <a href="/terms" className="ml-1 hover:text-indigo-600 transition-colors">Terms of Service</a>
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-slate-400 hover:text-indigo-600 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
                <a href="#" className="text-slate-400 hover:text-indigo-600 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
                  </svg>
                </a>
                <a href="#" className="text-slate-400 hover:text-indigo-600 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
