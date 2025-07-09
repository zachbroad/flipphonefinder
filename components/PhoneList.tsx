'use client'

import { Phone } from '@/lib/db'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

type SortField = 'brand' | 'name' | 'price' | 'released_on'
type SortDirection = 'asc' | 'desc'

interface PhoneListProps {
  initialPhones: Phone[]
}

export default function PhoneList({ initialPhones }: PhoneListProps) {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState<SortField>('name')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')
  const [priceRangeFilter, setPriceRangeFilter] = useState<string>('all')
  const [ratingFilter, setRatingFilter] = useState<string>('all')
  const [shapeFilter, setShapeFilter] = useState<string>('all')
  const [featureFilters, setFeatureFilters] = useState<{
    flip: boolean
    longBattery: boolean
    volte: boolean
    wifiCalling: boolean
    camera: boolean
    unlocked: boolean
  }>({
    flip: false,
    longBattery: false,
    volte: false,
    wifiCalling: false,
    camera: false,
    unlocked: false
  })

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const filteredAndSortedPhones = initialPhones
    .filter(phone => {
      const matchesSearch = !searchTerm ||
        phone.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        phone.name?.toLowerCase().includes(searchTerm.toLowerCase())

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
        const shapeValue = phone.shape
        let shapeStr: string

        if (typeof shapeValue === 'object' && shapeValue !== null) {
          if (Array.isArray(shapeValue)) {
            shapeStr = shapeValue.join(' ')
          } else {
            shapeStr = JSON.stringify(shapeValue)
          }
        } else {
          shapeStr = String(shapeValue)
        }

        const normalizedShape = shapeStr.toLowerCase().replace(/['"\[\]{}]/g, '').trim()
        return normalizedShape.includes(shapeFilter.toLowerCase())
      })()

      // Feature filters
      const matchesFeatures = (() => {
        // Check flip phones (based on shape)
        if (featureFilters.flip) {
          if (!phone.shape) return false
          const shapeValue = phone.shape
          let shapeStr: string
          if (typeof shapeValue === 'object' && shapeValue !== null) {
            if (Array.isArray(shapeValue)) {
              shapeStr = shapeValue.join(' ')
            } else {
              shapeStr = JSON.stringify(shapeValue)
            }
          } else {
            shapeStr = String(shapeValue)
          }
          const normalizedShape = shapeStr.toLowerCase()
          if (!normalizedShape.includes('flip') && !normalizedShape.includes('clamshell')) return false
        }

        // Check long battery (this is more subjective - we'll look for removable battery or large capacity indicators)
        if (featureFilters.longBattery) {
          // Check if phone has removable battery (usually indicates longer battery life potential)
          let hasGoodBattery = false
          if (phone.removable_battery) {
            const batteryValue = phone.removable_battery
            if (typeof batteryValue === 'object' && batteryValue !== null) {
              const batteryStr = JSON.stringify(batteryValue).toLowerCase()
              if (batteryStr.includes('true') || batteryStr.includes('yes') || batteryStr.includes('removable')) {
                hasGoodBattery = true
              }
            } else if (batteryValue) {
              hasGoodBattery = true
            }
          }
          if (!hasGoodBattery) return false
        }

        // Check VoLTE support
        if (featureFilters.volte && !phone.volte) return false

        // Check WiFi Calling
        if (featureFilters.wifiCalling) {
          if (!phone.wifi_calling) return false
          // Handle jsonb field - check if it's truthy or contains positive values
          const wifiCallingValue = phone.wifi_calling
          if (typeof wifiCallingValue === 'object' && wifiCallingValue !== null) {
            const wifiStr = JSON.stringify(wifiCallingValue).toLowerCase()
            if (!wifiStr.includes('true') && !wifiStr.includes('yes') && !wifiStr.includes('supported')) return false
          } else if (!wifiCallingValue) {
            return false
          }
        }

        // Check camera
        if (featureFilters.camera) {
          if (!phone.camera) return false
          // Handle jsonb field - check if camera exists and is not "none"
          const cameraValue = phone.camera
          if (typeof cameraValue === 'object' && cameraValue !== null) {
            const cameraStr = JSON.stringify(cameraValue).toLowerCase()
            if (cameraStr.includes('none') || cameraStr.includes('false') || cameraStr.includes('no')) return false
          } else if (!cameraValue) {
            return false
          }
        }

        // Check unlocked
        if (featureFilters.unlocked) {
          if (!phone.sold_unlocked) return false
          // Handle jsonb field - check if sold unlocked
          const unlockedValue = phone.sold_unlocked
          if (typeof unlockedValue === 'object' && unlockedValue !== null) {
            const unlockedStr = JSON.stringify(unlockedValue).toLowerCase()
            if (!unlockedStr.includes('true') && !unlockedStr.includes('yes') && !unlockedStr.includes('unlocked')) return false
          } else if (!unlockedValue) {
            return false
          }
        }

        return true
      })()

      return matchesSearch && matchesPrice && matchesRating && matchesShape && matchesFeatures
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
      } else if (sortField === 'released_on') {
        aValue = a.released_on ? new Date(a.released_on).getTime() : 0
        bValue = b.released_on ? new Date(b.released_on).getTime() : 0
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
      } else if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase()
        bValue = String(bValue || '').toLowerCase()
      } else if (typeof bValue === 'string') {
        aValue = String(aValue || '').toLowerCase()
        bValue = bValue.toLowerCase()
      }

      if (aValue !== null && bValue !== null && aValue < bValue) return sortDirection === 'asc' ? -1 : 1
      if (aValue !== null && bValue !== null && aValue > bValue) return sortDirection === 'asc' ? 1 : -1
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

  const uniqueShapes = [...new Set(initialPhones.map(phone => {
    if (!phone.shape) return null
    // Handle jsonb data - could be string, array, or object
    const shapeValue = phone.shape
    let shapeStr: string

    if (typeof shapeValue === 'object' && shapeValue !== null) {
      if (Array.isArray(shapeValue)) {
        shapeStr = shapeValue.join(' ')
      } else {
        shapeStr = JSON.stringify(shapeValue)
      }
    } else {
      shapeStr = String(shapeValue)
    }

    return shapeStr.toLowerCase().replace(/['"\[\]{}]/g, '').trim()
  }).filter(Boolean))]

  const handlePhoneClick = (phoneId: string) => {
    router.push(`/phones/${phoneId}`)
  }

  const toggleFeatureFilter = (feature: keyof typeof featureFilters) => {
    setFeatureFilters(prev => ({
      ...prev,
      [feature]: !prev[feature]
    }))
  }

  const clearAllFilters = () => {
    setSearchTerm('')
    setPriceRangeFilter('all')
    setRatingFilter('all')
    setShapeFilter('all')
    setFeatureFilters({
      flip: false,
      longBattery: false,
      volte: false,
      wifiCalling: false,
      camera: false,
      unlocked: false
    })
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
    <>
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
            <button
              onClick={() => toggleFeatureFilter('flip')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${featureFilters.flip
                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
                : 'bg-white/80 text-slate-700 hover:bg-white border border-slate-200 hover:shadow-md'
                }`}
            >
              📱 Flip Phones
            </button>
            <button
              onClick={() => toggleFeatureFilter('longBattery')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${featureFilters.longBattery
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg'
                : 'bg-white/80 text-slate-700 hover:bg-white border border-slate-200 hover:shadow-md'
                }`}
            >
              🔋 Long Battery
            </button>
            <button
              onClick={() => toggleFeatureFilter('volte')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${featureFilters.volte
                ? 'bg-gradient-to-r from-purple-500 to-violet-600 text-white shadow-lg'
                : 'bg-white/80 text-slate-700 hover:bg-white border border-slate-200 hover:shadow-md'
                }`}
            >
              📞 VoLTE Support
            </button>
            <button
              onClick={() => toggleFeatureFilter('wifiCalling')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${featureFilters.wifiCalling
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg'
                : 'bg-gray-100 text-slate-700 hover:bg-gray-200 border border-slate-200 hover:shadow-md'
                }`}
            >
              📶 WiFi Calling
            </button>
            <button
              onClick={() => toggleFeatureFilter('camera')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${featureFilters.camera
                ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-lg'
                : 'bg-gray-100 text-slate-700 hover:bg-gray-200 border border-slate-200 hover:shadow-md'
                }`}
            >
              📷 With Camera
            </button>
            <button
              onClick={() => toggleFeatureFilter('unlocked')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${featureFilters.unlocked
                ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg'
                : 'bg-gray-100 text-slate-700 hover:bg-gray-200 border border-slate-200 hover:shadow-md'
                }`}
            >
              🔓 Unlocked
            </button>
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
        {(searchTerm || priceRangeFilter !== 'all' || ratingFilter !== 'all' || shapeFilter !== 'all' || Object.values(featureFilters).some(Boolean)) && (
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
                {/* Feature filter badges */}
                {featureFilters.flip && (
                  <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-blue-100 text-blue-800">
                    📱 Flip Phones
                    <button
                      onClick={() => toggleFeatureFilter('flip')}
                      className="ml-1 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                )}
                {featureFilters.longBattery && (
                  <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-green-100 text-green-800">
                    🔋 Long Battery
                    <button
                      onClick={() => toggleFeatureFilter('longBattery')}
                      className="ml-1 text-green-600 hover:text-green-800"
                    >
                      ×
                    </button>
                  </span>
                )}
                {featureFilters.volte && (
                  <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-purple-100 text-purple-800">
                    📞 VoLTE
                    <button
                      onClick={() => toggleFeatureFilter('volte')}
                      className="ml-1 text-purple-600 hover:text-purple-800"
                    >
                      ×
                    </button>
                  </span>
                )}
                {featureFilters.wifiCalling && (
                  <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-cyan-100 text-cyan-800">
                    📶 WiFi Calling
                    <button
                      onClick={() => toggleFeatureFilter('wifiCalling')}
                      className="ml-1 text-cyan-600 hover:text-cyan-800"
                    >
                      ×
                    </button>
                  </span>
                )}
                {featureFilters.camera && (
                  <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-pink-100 text-pink-800">
                    📷 Camera
                    <button
                      onClick={() => toggleFeatureFilter('camera')}
                      className="ml-1 text-pink-600 hover:text-pink-800"
                    >
                      ×
                    </button>
                  </span>
                )}
                {featureFilters.unlocked && (
                  <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-orange-100 text-orange-800">
                    🔓 Unlocked
                    <button
                      onClick={() => toggleFeatureFilter('unlocked')}
                      className="ml-1 text-orange-600 hover:text-orange-800"
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
            Showing <span className="font-bold text-indigo-600">{filteredAndSortedPhones.length}</span> of <span className="font-bold">{initialPhones.length}</span> phones
          </p>
          <div className="flex items-center text-xs sm:text-sm text-slate-500 justify-center sm:justify-start">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            Table View
          </div>
        </div>
      </div>

      {/* Modern Table */}
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
                <th className="px-8 py-5 text-left">
                  <button
                    onClick={() => handleSort('released_on')}
                    className="flex items-center space-x-2 text-sm font-bold text-slate-800 hover:text-indigo-600 transition-colors duration-200 group"
                  >
                    <span>Released</span>
                    <div className="group-hover:scale-110 transition-transform duration-200">
                      {getSortIcon('released_on')}
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
                    <div className="text-slate-600 text-sm">
                      {phone.released_on ? new Date(phone.released_on).getFullYear() : (
                        <span className="text-slate-400">N/A</span>
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

      {filteredAndSortedPhones.length === 0 && (
        <div className="text-center py-32">
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-12 max-w-md mx-auto">
            <div className="text-8xl mb-6 filter grayscale opacity-60">🔍</div>
            <h3 className="text-3xl font-bold text-slate-800 mb-4">No devices found</h3>
            <p className="text-slate-600 leading-relaxed">Try adjusting your search terms or filters to discover more digital wellness devices</p>
          </div>
        </div>
      )}
    </>
  )
}