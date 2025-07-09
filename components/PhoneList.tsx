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
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')
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
      // Only prioritize featured phones when sorting by default field (name)
      if (sortField === 'name' && a.featured !== b.featured) {
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
      }

      // Then sort by the selected field
      let aValue: string | number | null = a[sortField] as string | number | null
      let bValue: string | number | null = b[sortField] as string | number | null

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

  const handlePhoneClick = (phoneSlug: string) => {
    router.push(`/phones/${phoneSlug}`)
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
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 border border-gray-300 hover:border-gray-400 shadow-sm'
                }`}
            >
              📱 Flip Phones
            </button>
            <button
              onClick={() => toggleFeatureFilter('longBattery')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${featureFilters.longBattery
                ? 'bg-green-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 border border-gray-300 hover:border-gray-400 shadow-sm'
                }`}
            >
              🔋 Long Battery
            </button>
            <button
              onClick={() => toggleFeatureFilter('volte')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${featureFilters.volte
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 border border-gray-300 hover:border-gray-400 shadow-sm'
                }`}
            >
              📞 VoLTE Support
            </button>
            <button
              onClick={() => toggleFeatureFilter('wifiCalling')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${featureFilters.wifiCalling
                ? 'bg-cyan-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 border border-gray-300 hover:border-gray-400 shadow-sm'
                }`}
            >
              📶 WiFi Calling
            </button>
            <button
              onClick={() => toggleFeatureFilter('camera')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${featureFilters.camera
                ? 'bg-pink-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 border border-gray-300 hover:border-gray-400 shadow-sm'
                }`}
            >
              📷 With Camera
            </button>
            <button
              onClick={() => toggleFeatureFilter('unlocked')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${featureFilters.unlocked
                ? 'bg-orange-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 border border-gray-300 hover:border-gray-400 shadow-sm'
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
                ? 'bg-gray-800 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 border border-gray-300 hover:border-gray-400 shadow-sm'
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
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 border border-gray-300 hover:border-gray-400 shadow-sm'
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
                ? 'bg-gray-800 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 border border-gray-300 hover:border-gray-400 shadow-sm'
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
                  ? 'bg-amber-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 border border-gray-300 hover:border-gray-400 shadow-sm'
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
                  ? 'bg-gray-800 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 border border-gray-300 hover:border-gray-400 shadow-sm'
                  }`}
              >
                All Shapes
              </button>
              {uniqueShapes.map(shape => shape && (
                <button
                  key={shape}
                  onClick={() => setShapeFilter(shape)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${shapeFilter === shape
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 border border-gray-300 hover:border-gray-400 shadow-sm'
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

      {/* Results Count & View Toggle */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <p className="text-gray-600 font-medium text-sm">
            Showing <span className="font-bold text-black">{filteredAndSortedPhones.length}</span> of <span className="font-bold">{initialPhones.length}</span> phones
          </p>
          
          {/* View Toggle */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                viewMode === 'grid'
                  ? 'bg-white text-black shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              Grid
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                viewMode === 'table'
                  ? 'bg-white text-black shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              Table
            </button>
          </div>
        </div>
      </div>

      {/* Sort Options */}
      <div className="mb-6 flex flex-wrap gap-3 justify-center">
        {(['brand', 'name', 'price', 'released_on'] as const).map((field) => (
          <button
            key={field}
            onClick={() => handleSort(field)}
            className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              sortField === field
                ? 'bg-black text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 border border-gray-300 hover:border-gray-400 shadow-sm'
            }`}
          >
            <span className="capitalize">{field === 'released_on' ? 'Released' : field}</span>
            {sortField === field && (
              <span className="ml-2 text-xs">
                {sortDirection === 'asc' ? '↑' : '↓'}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Phone Display - Grid or Table */}
      {viewMode === 'grid' ? (
        /* Enhanced Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAndSortedPhones.map((phone) => (
            <div
              key={phone.id}
              onClick={() => handlePhoneClick(phone.slug || phone.id.toString())}
              className={`relative bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer group overflow-hidden ${
                phone.featured ? 'ring-2 ring-amber-400' : ''
              }`}
            >
            {/* Price Badge - Top Right */}
            {phone.price && (
              <div className="absolute top-4 right-4 bg-black text-white px-3 py-1 rounded-full text-sm font-bold z-10">
                ${parseFloat(phone.price).toLocaleString()}
              </div>
            )}
            
            {/* Featured Badge - Top Left */}
            {phone.featured && (
              <div className="absolute top-4 left-4 bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs font-medium z-10">
                Featured
              </div>
            )}
            
            {/* Image */}
            <div className="aspect-square bg-gray-50 relative w-full overflow-hidden">
              {phone.image ? (
                <Image
                  src={phone.image}
                  alt={`${phone.brand} ${phone.name}`}
                  width={400}
                  height={400}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                  unoptimized
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                    const fallback = e.currentTarget.parentElement?.querySelector('.fallback-icon')
                    if (fallback) {
                      fallback.classList.remove('hidden')
                    }
                  }}
                />
              ) : null}
              <div className={`absolute inset-0 flex items-center justify-center fallback-icon ${phone.image ? 'hidden' : ''}`}>
                <span className="text-6xl text-gray-300">📱</span>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              {/* Brand & Name */}
              <div className="mb-3">
                <p className="text-xs font-medium text-gray-500 mb-1">
                  {phone.brand || 'Unknown'}
                </p>
                <h3 className="text-base font-semibold text-gray-900 leading-tight">
                  {phone.name || 'Unknown'}
                </h3>
              </div>

              {/* Key Features */}
              <div className="flex flex-wrap gap-1 mb-3">
                  {(() => {
                    const features = []
                    
                    // Check if it's a flip phone
                    if (phone.shape) {
                      const shapeStr = typeof phone.shape === 'object' 
                        ? JSON.stringify(phone.shape).toLowerCase()
                        : String(phone.shape).toLowerCase()
                      if (shapeStr.includes('flip') || shapeStr.includes('clamshell')) {
                        features.push({ name: 'Flip', color: 'bg-blue-100 text-blue-800' })
                      }
                    }
                    
                    // VoLTE
                    if (phone.volte) {
                      features.push({ name: 'VoLTE', color: 'bg-green-100 text-green-800' })
                    }
                    
                    // Camera
                    if (phone.camera) {
                      const cameraStr = typeof phone.camera === 'object'
                        ? JSON.stringify(phone.camera).toLowerCase()
                        : String(phone.camera).toLowerCase()
                      if (!cameraStr.includes('none') && !cameraStr.includes('false')) {
                        features.push({ name: 'Camera', color: 'bg-purple-100 text-purple-800' })
                      }
                    }
                    
                    // Unlocked
                    if (phone.sold_unlocked) {
                      const unlockedStr = typeof phone.sold_unlocked === 'object'
                        ? JSON.stringify(phone.sold_unlocked).toLowerCase()
                        : String(phone.sold_unlocked).toLowerCase()
                      if (unlockedStr.includes('true') || unlockedStr.includes('yes') || unlockedStr.includes('unlocked')) {
                        features.push({ name: 'Unlocked', color: 'bg-orange-100 text-orange-800' })
                      }
                    }
                    
                    return features.slice(0, 3).map((feature, index) => (
                      <span
                        key={index}
                        className={`inline-flex items-center px-2 py-1 ${feature.color} text-xs font-medium rounded-full`}
                      >
                        {feature.name}
                      </span>
                    ))
                  })()}
                </div>

                {/* Rating & Year */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    {phone.rating ? (
                      <div className="flex items-center">
                        <span className="text-amber-400 mr-1">★</span>
                        <span className="text-sm font-medium text-gray-900">
                          {phone.rating.toFixed(1)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">No rating</span>
                    )}
                  </div>
                  {phone.released_on && (
                    <span className="text-xs text-gray-500">
                      {new Date(phone.released_on).getFullYear()}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handlePhoneClick(phone.slug || phone.id.toString())
                    }}
                    className="flex-1 bg-black text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors duration-200"
                  >
                    Details
                  </button>
                  {phone.link && (
                    <a
                      href={phone.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors duration-200 text-center"
                    >
                      Buy
                    </a>
                  )}
                </div>
              </div>
            </div>
            ))}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Features
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Year
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAndSortedPhones.map((phone) => (
                    <tr
                      key={phone.id}
                      onClick={() => handlePhoneClick(phone.slug || phone.id.toString())}
                      className={`hover:bg-gray-50 cursor-pointer transition-colors duration-200 ${
                        phone.featured ? 'bg-amber-50' : ''
                      }`}
                    >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-12 w-12 flex-shrink-0 mr-4">
                          {phone.image ? (
                            <Image
                              src={phone.image}
                              alt={`${phone.brand} ${phone.name}`}
                              width={48}
                              height={48}
                              className="h-12 w-12 object-cover rounded-lg"
                              unoptimized
                            />
                          ) : (
                            <div className="h-12 w-12 bg-gray-200 rounded-lg flex items-center justify-center">
                              <span className="text-gray-400">📱</span>
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {phone.brand} {phone.name}
                            {phone.featured && (
                              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                                Featured
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-500">
                            {phone.brand || 'Unknown Brand'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {(() => {
                          const features = []
                          
                          if (phone.shape) {
                            const shapeStr = typeof phone.shape === 'object' 
                              ? JSON.stringify(phone.shape).toLowerCase()
                              : String(phone.shape).toLowerCase()
                            if (shapeStr.includes('flip') || shapeStr.includes('clamshell')) {
                              features.push({ name: 'Flip', color: 'bg-blue-100 text-blue-800' })
                            }
                          }
                          
                          if (phone.volte) {
                            features.push({ name: 'VoLTE', color: 'bg-green-100 text-green-800' })
                          }
                          
                          if (phone.camera) {
                            const cameraStr = typeof phone.camera === 'object'
                              ? JSON.stringify(phone.camera).toLowerCase()
                              : String(phone.camera).toLowerCase()
                            if (!cameraStr.includes('none') && !cameraStr.includes('false')) {
                              features.push({ name: 'Camera', color: 'bg-purple-100 text-purple-800' })
                            }
                          }
                          
                          if (phone.sold_unlocked) {
                            const unlockedStr = typeof phone.sold_unlocked === 'object'
                              ? JSON.stringify(phone.sold_unlocked).toLowerCase()
                              : String(phone.sold_unlocked).toLowerCase()
                            if (unlockedStr.includes('true') || unlockedStr.includes('yes') || unlockedStr.includes('unlocked')) {
                              features.push({ name: 'Unlocked', color: 'bg-orange-100 text-orange-800' })
                            }
                          }
                          
                          return features.slice(0, 4).map((feature, index) => (
                            <span
                              key={index}
                              className={`inline-flex items-center px-2 py-1 ${feature.color} text-xs font-medium rounded-full`}
                            >
                              {feature.name}
                            </span>
                          ))
                        })()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {phone.price ? `$${parseFloat(phone.price).toLocaleString()}` : (
                          <span className="text-gray-400">Price varies</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {phone.rating ? (
                          <>
                            <span className="text-amber-400 mr-1">★</span>
                            <span className="text-sm font-medium text-gray-900">
                              {phone.rating.toFixed(1)}
                            </span>
                          </>
                        ) : (
                          <span className="text-sm text-gray-400">No rating</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {phone.released_on ? new Date(phone.released_on).getFullYear() : 'Unknown'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handlePhoneClick(phone.slug || phone.id.toString())
                          }}
                          className="bg-black text-white py-1 px-3 rounded-md text-sm hover:bg-gray-800 transition-colors duration-200"
                        >
                          Details
                        </button>
                        {phone.link && (
                          <a
                            href={phone.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="bg-blue-600 text-white py-1 px-3 rounded-md text-sm hover:bg-blue-700 transition-colors duration-200"
                          >
                            Buy
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