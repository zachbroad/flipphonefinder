'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface Phone {
  id: string
  brand: string
  model: string
  price: number | null
  condition: string
  description: string | null
  imageUrl: string | null
}

type SortField = 'brand' | 'model' | 'price' | 'condition'
type SortDirection = 'asc' | 'desc'

export default function Home() {
  const [phones, setPhones] = useState<Phone[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [sortField, setSortField] = useState<SortField>('brand')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')
  const [conditionFilter, setConditionFilter] = useState<string>('all')
  const [priceRangeFilter, setPriceRangeFilter] = useState<string>('all')

  useEffect(() => {
    const fetchPhones = async () => {
      try {
        const response = await fetch('/api/phones')
        const data = await response.json()
        setPhones(data)
      } catch (error) {
        console.error('Error fetching phones:', error)
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
      const matchesSearch = phone.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        phone.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        phone.description?.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesCondition = conditionFilter === 'all' || phone.condition === conditionFilter
      
      const matchesPrice = priceRangeFilter === 'all' || (() => {
        if (!phone.price) return priceRangeFilter === 'unknown'
        switch (priceRangeFilter) {
          case 'under-100': return phone.price < 100
          case '100-300': return phone.price >= 100 && phone.price <= 300
          case '300-600': return phone.price > 300 && phone.price <= 600
          case 'over-600': return phone.price > 600
          default: return true
        }
      })()
      
      return matchesSearch && matchesCondition && matchesPrice
    })
    .sort((a, b) => {
      let aValue: any = a[sortField]
      let bValue: any = b[sortField]
      
      if (sortField === 'price') {
        aValue = a.price || 0
        bValue = b.price || 0
      }
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
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

  const uniqueConditions = [...new Set(phones.map(phone => phone.condition))]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Navbar */}
        <nav className="bg-white/90 backdrop-blur-lg border-b border-white/20 sticky top-0 z-50 mb-8">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-indigo-900 bg-clip-text text-transparent">
                  📱 FlipPhoneFinder
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-slate-600">
                  {phones.length} phones available
                </span>
              </div>
            </div>
          </div>
        </nav>

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-800 mb-2">
            Find Your Perfect Flip Phone
          </h2>
          <p className="text-lg text-slate-600">
            Compare features, prices, and conditions with advanced filtering
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by brand, model, or features..."
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
            {/* Condition Pills */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setConditionFilter('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  conditionFilter === 'all'
                    ? 'bg-gradient-to-r from-slate-600 to-slate-700 text-white shadow-lg'
                    : 'bg-white/80 text-slate-700 hover:bg-white border border-slate-200 hover:shadow-md'
                }`}
              >
                All Conditions
              </button>
              {uniqueConditions.map(condition => (
                <button
                  key={condition}
                  onClick={() => setConditionFilter(condition)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    conditionFilter === condition
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
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  priceRangeFilter === 'all'
                    ? 'bg-gradient-to-r from-slate-600 to-slate-700 text-white shadow-lg'
                    : 'bg-white/80 text-slate-700 hover:bg-white border border-slate-200 hover:shadow-md'
                }`}
              >
                All Prices
              </button>
              {[
                { value: 'under-100', label: '💰 Under $100' },
                { value: '100-300', label: '💰 $100-$300' },
                { value: '300-600', label: '💰 $300-$600' },
                { value: 'over-600', label: '💰 Over $600' },
                { value: 'unknown', label: '💰 Price Unknown' }
              ].map(price => (
                <button
                  key={price.value}
                  onClick={() => setPriceRangeFilter(price.value)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    priceRangeFilter === price.value
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                      : 'bg-white/80 text-slate-700 hover:bg-white border border-slate-200 hover:shadow-md'
                  }`}
                >
                  {price.label}
                </button>
              ))}
            </div>
          </div>

          {/* Active Filters Summary */}
          {(searchTerm || conditionFilter !== 'all' || priceRangeFilter !== 'all') && (
            <div className="mt-4 text-center">
              <div className="inline-flex items-center px-4 py-2 bg-white/80 rounded-xl border border-slate-200">
                <span className="text-sm text-slate-600 mr-3">Active filters:</span>
                <div className="flex flex-wrap gap-2">
                  {searchTerm && (
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-blue-100 text-blue-800">
                      "{searchTerm}"
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
                </div>
                <button
                  onClick={() => {
                    setSearchTerm('')
                    setConditionFilter('all')
                    setPriceRangeFilter('all')
                  }}
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
          <div className="flex items-center justify-between bg-white/60 backdrop-blur-sm rounded-xl px-6 py-4 border border-white/30">
            <p className="text-slate-700 font-medium">
              Showing <span className="font-bold text-indigo-600">{filteredAndSortedPhones.length}</span> of <span className="font-bold">{phones.length}</span> phones
            </p>
            <div className="flex items-center text-sm text-slate-500">
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
                        onClick={() => handleSort('model')}
                        className="flex items-center space-x-2 text-sm font-bold text-slate-800 hover:text-indigo-600 transition-colors duration-200 group"
                      >
                        <span>Model</span>
                        <div className="group-hover:scale-110 transition-transform duration-200">
                          {getSortIcon('model')}
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
                        onClick={() => handleSort('condition')}
                        className="flex items-center space-x-2 text-sm font-bold text-slate-800 hover:text-indigo-600 transition-colors duration-200 group"
                      >
                        <span>Condition</span>
                        <div className="group-hover:scale-110 transition-transform duration-200">
                          {getSortIcon('condition')}
                        </div>
                      </button>
                    </th>
                    <th className="px-8 py-5 text-left text-sm font-bold text-slate-800">
                      Image
                    </th>
                    <th className="px-8 py-5 text-left text-sm font-bold text-slate-800">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredAndSortedPhones.map((phone, index) => (
                    <tr key={phone.id} className="hover:bg-gradient-to-r hover:from-indigo-50 hover:to-blue-50 transition-all duration-200 group">
                      <td className="px-8 py-6">
                        <div className="font-bold text-slate-900 group-hover:text-indigo-700 transition-colors duration-200">{phone.brand}</div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="text-slate-800 font-medium">{phone.model}</div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="font-bold text-emerald-600 text-lg">
                          {phone.price ? `$${phone.price.toLocaleString()}` : (
                            <span className="text-slate-400 text-sm font-normal">N/A</span>
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`inline-flex px-3 py-1.5 text-xs font-bold rounded-full shadow-md ${
                          phone.condition === 'New' 
                            ? 'bg-gradient-to-r from-emerald-400 to-emerald-600 text-white' 
                            : phone.condition === 'Refurbished'
                            ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white'
                            : 'bg-gradient-to-r from-slate-400 to-slate-600 text-white'
                        }`}>
                          {phone.condition}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="h-20 w-20 relative group-hover:scale-110 transition-transform duration-200">
                          {phone.imageUrl ? (
                            <Image
                              src={phone.imageUrl}
                              alt={`${phone.brand} ${phone.model}`}
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
                        <div className="text-sm text-slate-600 max-w-xs leading-relaxed">
                          {phone.description || (
                            <span className="italic text-slate-400">No description available</span>
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
              <h3 className="text-3xl font-bold text-slate-800 mb-4">No phones found</h3>
              <p className="text-slate-600 leading-relaxed">Try adjusting your search terms or filters to discover more phones</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
