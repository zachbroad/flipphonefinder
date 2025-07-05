'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Phone } from '@/types/phone'

export default function Compare() {
  const [phones, setPhones] = useState<Phone[]>([])
  const [selectedPhones, setSelectedPhones] = useState<Phone[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

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

  const addPhoneToCompare = (phone: Phone) => {
    if (selectedPhones.length < 4 && !selectedPhones.find(p => p.id === phone.id)) {
      setSelectedPhones([...selectedPhones, phone])
    }
  }

  const removePhoneFromCompare = (phoneId: string) => {
    setSelectedPhones(selectedPhones.filter(p => p.id !== phoneId))
  }

  const formatEnumValue = (value: string | null) => {
    if (!value) return 'N/A'
    return value.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
  }

  const getBooleanIcon = (value: boolean) => {
    return value ? '✅' : '❌'
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

  const renderFeatureValue = (phone: Phone, feature: any) => {
    const value = phone[feature.key as keyof Phone]
    
    switch (feature.type) {
      case 'text':
        return value || 'N/A'
      case 'price':
        return value ? `$${parseFloat(value as string).toLocaleString()}` : 'N/A'
      case 'rating':
        return value ? '⭐'.repeat(value as number) : 'No rating'
      case 'enum':
        return formatEnumValue(value as string)
      case 'boolean':
        return getBooleanIcon(Boolean(value))
      default:
        return value || 'N/A'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Navbar */}
        <nav className="bg-white/90 backdrop-blur-lg border-b border-white/20 sticky top-0 z-50 mb-8">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <a href="/" className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-indigo-900 bg-clip-text text-transparent">
                  📱 FlipPhoneFinder
                </a>
              </div>
              <div className="hidden md:flex items-center space-x-8">
                <a href="/" className="text-slate-700 hover:text-indigo-600 transition-colors font-medium">Browse Phones</a>
                <a href="/compare" className="text-slate-700 hover:text-indigo-600 transition-colors font-medium text-indigo-600">Compare</a>
                <a href="/guides" className="text-slate-700 hover:text-indigo-600 transition-colors font-medium">Buying Guides</a>
                <a href="/blog" className="text-slate-700 hover:text-indigo-600 transition-colors font-medium">Blog</a>
                <a href="/contact" className="text-slate-700 hover:text-indigo-600 transition-colors font-medium">Contact</a>
              </div>
            </div>
          </div>
        </nav>

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
                  <div key={index} className="bg-slate-100 rounded-xl p-4 flex items-center justify-center border-2 border-dashed border-slate-300">
                    <div className="text-center text-slate-400">
                      <div className="text-3xl mb-2">+</div>
                      <p className="text-sm">Add Phone</p>
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
                  <div key={phone.id} className={`border-2 rounded-xl p-4 transition-all ${
                    isSelected 
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
                          className={`w-full py-2 text-sm font-medium rounded-lg transition-colors ${
                            canAdd
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
      </div>
    </div>
  )
}