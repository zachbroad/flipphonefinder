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
    if (sortField !== field) return '↕️'
    return sortDirection === 'asc' ? '↑' : '↓'
  }

  const uniqueConditions = [...new Set(phones.map(phone => phone.condition))]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            FlipPhoneFinder
          </h1>
          <p className="text-gray-600">
            Compare and filter flip phones with advanced sorting options
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search phones..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <svg className="w-5 h-5 text-gray-400 absolute right-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Condition Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Condition
              </label>
              <select
                value={conditionFilter}
                onChange={(e) => setConditionFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Conditions</option>
                {uniqueConditions.map(condition => (
                  <option key={condition} value={condition}>{condition}</option>
                ))}
              </select>
            </div>

            {/* Price Range Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price Range
              </label>
              <select
                value={priceRangeFilter}
                onChange={(e) => setPriceRangeFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Prices</option>
                <option value="under-100">Under $100</option>
                <option value="100-300">$100 - $300</option>
                <option value="300-600">$300 - $600</option>
                <option value="over-600">Over $600</option>
                <option value="unknown">Price Unknown</option>
              </select>
            </div>
          </div>

          {/* Active Filters */}
          <div className="mt-4 flex flex-wrap gap-2">
            {searchTerm && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                Search: "{searchTerm}"
                <button
                  onClick={() => setSearchTerm('')}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            )}
            {conditionFilter !== 'all' && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                Condition: {conditionFilter}
                <button
                  onClick={() => setConditionFilter('all')}
                  className="ml-2 text-green-600 hover:text-green-800"
                >
                  ×
                </button>
              </span>
            )}
            {priceRangeFilter !== 'all' && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800">
                Price: {priceRangeFilter.replace('-', ' - $').replace('under', 'Under $').replace('over', 'Over $')}
                <button
                  onClick={() => setPriceRangeFilter('all')}
                  className="ml-2 text-purple-600 hover:text-purple-800"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-gray-600">
            Showing {filteredAndSortedPhones.length} of {phones.length} phones
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          /* Table */
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <button
                        onClick={() => handleSort('brand')}
                        className="flex items-center space-x-1 text-sm font-medium text-gray-900 hover:text-blue-600"
                      >
                        <span>Brand</span>
                        <span className="text-gray-400">{getSortIcon('brand')}</span>
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left">
                      <button
                        onClick={() => handleSort('model')}
                        className="flex items-center space-x-1 text-sm font-medium text-gray-900 hover:text-blue-600"
                      >
                        <span>Model</span>
                        <span className="text-gray-400">{getSortIcon('model')}</span>
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left">
                      <button
                        onClick={() => handleSort('price')}
                        className="flex items-center space-x-1 text-sm font-medium text-gray-900 hover:text-blue-600"
                      >
                        <span>Price</span>
                        <span className="text-gray-400">{getSortIcon('price')}</span>
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left">
                      <button
                        onClick={() => handleSort('condition')}
                        className="flex items-center space-x-1 text-sm font-medium text-gray-900 hover:text-blue-600"
                      >
                        <span>Condition</span>
                        <span className="text-gray-400">{getSortIcon('condition')}</span>
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">
                      Image
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredAndSortedPhones.map((phone) => (
                    <tr key={phone.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{phone.brand}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-gray-900">{phone.model}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900">
                          {phone.price ? `$${phone.price.toLocaleString()}` : 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          phone.condition === 'New' 
                            ? 'bg-green-100 text-green-800' 
                            : phone.condition === 'Refurbished'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {phone.condition}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-16 w-16 relative">
                          {phone.imageUrl ? (
                            <Image
                              src={phone.imageUrl}
                              alt={`${phone.brand} ${phone.model}`}
                              fill
                              className="object-cover rounded-lg"
                            />
                          ) : (
                            <div className="h-16 w-16 bg-gray-100 rounded-lg flex items-center justify-center">
                              <span className="text-2xl">📱</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600 max-w-xs truncate">
                          {phone.description || 'No description available'}
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
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No phones found</h3>
            <p className="text-gray-600">Try adjusting your search terms or filters</p>
          </div>
        )}
      </div>
    </div>
  )
}
