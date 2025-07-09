'use client'

import { Phone } from '@/types/phone'
import Image from 'next/image'
import { ReactNode, useEffect, useState } from 'react'

export default function Compare() {
  const [phones, setPhones] = useState<Phone[]>([])
  const [selectedPhones, setSelectedPhones] = useState<Phone[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [modalSearchTerm, setModalSearchTerm] = useState('')

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

  const filteredPhones = phones.filter(phone =>
    !searchTerm ||
    phone.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    phone.name?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const modalFilteredPhones = phones.filter(phone =>
    (!modalSearchTerm ||
      phone.brand?.toLowerCase().includes(modalSearchTerm.toLowerCase()) ||
      phone.name?.toLowerCase().includes(modalSearchTerm.toLowerCase())) &&
    !selectedPhones.find(p => p.id === phone.id) // Exclude already selected phones
  )

  const addPhoneToCompare = (phone: Phone) => {
    if (selectedPhones.length < 4 && !selectedPhones.find(p => p.id === phone.id)) {
      setSelectedPhones([...selectedPhones, phone])
    }
  }

  const removePhoneFromCompare = (phoneId: number) => {
    setSelectedPhones(selectedPhones.filter(p => p.id !== phoneId))
  }

  const formatEnumValue = (value: unknown) => {
    if (!value) return 'N/A'

    // Handle different data types from jsonb fields
    if (typeof value === 'string') {
      return value.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
    }

    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No'
    }

    if (Array.isArray(value)) {
      return value.join(', ')
    }

    if (typeof value === 'object') {
      return JSON.stringify(value)
    }

    return String(value)
  }

  const getBooleanIcon = (value: boolean) => {
    return value ? '✅' : '❌'
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

  const comparisonFeatures = [
    { key: 'brand', label: 'Brand', type: 'text' },
    { key: 'name', label: 'Model', type: 'text' },
    { key: 'price', label: 'Price', type: 'price' },
    { key: 'rating', label: 'Rating', type: 'rating' },
    { key: 'category', label: 'Category', type: 'enum' },
    { key: 'shape', label: 'Shape', type: 'enum' },
    { key: 'operating_system', label: 'Operating System', type: 'enum' },
    { key: 'screen_type', label: 'Screen Type', type: 'enum' },
    { key: 't9_keyboard', label: 'Keyboard Type', type: 'enum' },
    { key: 'usb_type', label: 'USB Type', type: 'enum' },
    { key: 'sold_unlocked', label: 'Sold Unlocked', type: 'boolean' },
    { key: 'volte', label: 'VoLTE Support', type: 'boolean' },
    { key: 'wifi_calling', label: 'WiFi Calling', type: 'boolean' },
    { key: 'hotspot_tethering', label: 'Hotspot/Tethering', type: 'boolean' },
    { key: 'dual_sim', label: 'Dual SIM', type: 'boolean' },
    { key: 'esim', label: 'eSIM Support', type: 'boolean' },
    { key: 'whatsapp', label: 'WhatsApp', type: 'boolean' },
    { key: 'spotify', label: 'Spotify', type: 'boolean' },
    { key: 'gps_navigation', label: 'GPS Navigation', type: 'enum' },
    { key: 'group_text_mms', label: 'Group Text/MMS', type: 'boolean' },
    { key: 'rideshare', label: 'Rideshare Compatible', type: 'enum' },
    { key: 'signal_app', label: 'Signal App', type: 'boolean' },
    { key: 'email', label: 'Email', type: 'boolean' },
    { key: 'removable_battery', label: 'Removable Battery', type: 'boolean' },
    { key: 'browser', label: 'Browser', type: 'boolean' },
    { key: 'sd_cards', label: 'SD Card Support', type: 'boolean' },
    { key: 'voice_to_text', label: 'Voice to Text', type: 'boolean' },
    { key: 'headphone_jack', label: 'Headphone Jack', type: 'boolean' },
    { key: 'camera', label: 'Camera', type: 'boolean' },
    { key: 'calendar', label: 'Calendar', type: 'boolean' },
    { key: 'touchscreen', label: 'Touchscreen', type: 'boolean' },
    { key: 'android_auto', label: 'Android Auto', type: 'boolean' },
    { key: 'nfc_support', label: 'NFC Support', type: 'boolean' },
    { key: 'rugged', label: 'Rugged Design', type: 'boolean' },
  ]

  const renderFeatureValue = (phone: Phone, feature: { key: string; type: string }): ReactNode => {
    const value = phone[feature.key as keyof Phone]

    switch (feature.type) {
      case 'text':
        return value as string || 'N/A'
      case 'price':
        return value ? `$${parseFloat(value as string).toLocaleString()}` : 'N/A'
      case 'rating':
        return value ? renderStars(value as number) : 'No rating'
      case 'enum':
        return formatEnumValue(value as string)
      case 'boolean':
        return getBooleanIcon(Boolean(value))
      default:
        return String(value || 'N/A')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">
            Compare Flip Phones
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Select up to 4 phones to compare their features, specifications, and pricing side by side
          </p>
        </div>

        {/* Selected Phones for Comparison */}
        {selectedPhones.length > 0 && (
          <div className="mb-8">
            <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-white/30 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-slate-800">
                  Comparing {selectedPhones.length} Phone{selectedPhones.length > 1 ? 's' : ''}
                </h2>
                <button
                  onClick={() => setSelectedPhones([])}
                  className="text-slate-500 hover:text-slate-700 text-sm"
                >
                  Clear All
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {selectedPhones.map((phone) => (
                  <div key={phone.id} className="bg-slate-50 rounded-xl p-4 relative">
                    <button
                      onClick={() => removePhoneFromCompare(phone.id)}
                      className="absolute top-2 right-2 text-slate-400 hover:text-red-500 text-xl"
                    >
                      ×
                    </button>
                    <div className="text-center">
                      <div className="w-20 h-20 mx-auto mb-3 relative">
                        {phone.image ? (
                          <Image
                            src={phone.image}
                            alt={`${phone.brand} ${phone.name}`}
                            fill
                            className="object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center">
                            <span className="text-2xl">📱</span>
                          </div>
                        )}
                      </div>
                      <h3 className="font-bold text-slate-800 text-sm">{phone.brand}</h3>
                      <p className="text-slate-600 text-xs">{phone.name}</p>
                    </div>
                  </div>
                ))}

                {/* Add more slots if less than 4 */}
                {Array.from({ length: 4 - selectedPhones.length }).map((_, index) => (
                  <div
                    key={index}
                    onClick={() => setShowModal(true)}
                    className="bg-slate-100 rounded-xl p-4 flex items-center justify-center border-2 border-dashed border-slate-300 hover:border-indigo-400 hover:bg-slate-50 cursor-pointer transition-all duration-200 group"
                  >
                    <div className="text-center text-slate-400 group-hover:text-indigo-600">
                      <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">+</div>
                      <p className="text-sm font-medium">Add Phone</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Comparison Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-2 px-4 font-semibold text-slate-700">Feature</th>
                      {selectedPhones.map((phone) => (
                        <th key={phone.id} className="text-center py-2 px-4 font-semibold text-slate-700">
                          {phone.brand} {phone.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonFeatures.map((feature) => (
                      <tr key={feature.key} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-2 px-4 font-medium text-slate-700">{feature.label}</td>
                        {selectedPhones.map((phone) => (
                          <td key={phone.id} className="py-2 px-4 text-center text-slate-600">
                            {renderFeatureValue(phone, feature)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Phone Selection */}
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-white/30 p-6">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">
            Select Phones to Compare
          </h2>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <input
                type="text"
                placeholder="Search phones..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              />
              <div className="absolute right-3 top-3">
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-indigo-200 border-t-indigo-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredPhones.map((phone) => {
                const isSelected = selectedPhones.find(p => p.id === phone.id)
                const canAdd = selectedPhones.length < 4 && !isSelected

                return (
                  <div key={phone.id} className={`border-2 rounded-xl p-4 transition-all ${isSelected
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}>
                    <div className="text-center">
                      <div className="w-20 h-20 mx-auto mb-3 relative">
                        {phone.image ? (
                          <Image
                            src={phone.image}
                            alt={`${phone.brand} ${phone.name}`}
                            fill
                            className="object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center">
                            <span className="text-2xl">📱</span>
                          </div>
                        )}
                      </div>
                      <h3 className="font-bold text-slate-800 text-sm mb-1">{phone.brand}</h3>
                      <p className="text-slate-600 text-xs mb-2">{phone.name}</p>
                      <p className="text-emerald-600 font-semibold text-sm mb-3">
                        {phone.price ? `$${parseFloat(phone.price).toLocaleString()}` : 'Price N/A'}
                      </p>

                      {isSelected ? (
                        <button
                          onClick={() => removePhoneFromCompare(phone.id)}
                          className="w-full py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition-colors"
                        >
                          Remove
                        </button>
                      ) : (
                        <button
                          onClick={() => addPhoneToCompare(phone)}
                          disabled={!canAdd}
                          className={`w-full py-2 text-sm font-medium rounded-lg transition-colors ${canAdd
                            ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                            }`}
                        >
                          {canAdd ? 'Add to Compare' : 'Max 4 Phones'}
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Phone Selection Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
              <div className="p-6 border-b border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-slate-800">Add Phone to Compare</h2>
                  <button
                    onClick={() => {
                      setShowModal(false)
                      setModalSearchTerm('')
                    }}
                    className="text-slate-400 hover:text-slate-600 text-2xl"
                  >
                    ×
                  </button>
                </div>

                {/* Modal Search */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search phones..."
                    value={modalSearchTerm}
                    onChange={(e) => setModalSearchTerm(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  />
                  <div className="absolute right-3 top-3">
                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Modal Phone List */}
              <div className="p-6 overflow-y-auto max-h-96">
                {modalFilteredPhones.length === 0 ? (
                  <p className="text-center text-slate-500 py-8">No phones available to add</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {modalFilteredPhones.map((phone) => (
                      <div
                        key={phone.id}
                        onClick={() => {
                          addPhoneToCompare(phone)
                          setShowModal(false)
                          setModalSearchTerm('')
                        }}
                        className="border-2 border-slate-200 rounded-xl p-4 hover:border-indigo-500 hover:bg-indigo-50 cursor-pointer transition-all duration-200 group"
                      >
                        <div className="text-center">
                          <div className="w-16 h-16 mx-auto mb-3 relative">
                            {phone.image ? (
                              <Image
                                src={phone.image}
                                alt={`${phone.brand} ${phone.name}`}
                                fill
                                className="object-cover rounded-lg"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center">
                                <span className="text-xl">📱</span>
                              </div>
                            )}
                          </div>
                          <h3 className="font-bold text-slate-800 text-sm mb-1 group-hover:text-indigo-700">{phone.brand}</h3>
                          <p className="text-slate-600 text-xs mb-2">{phone.name}</p>
                          <p className="text-emerald-600 font-semibold text-sm">
                            {phone.price ? `$${parseFloat(phone.price).toLocaleString()}` : 'Price N/A'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}