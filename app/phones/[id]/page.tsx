'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Phone } from '@/types/phone'

export default function PhoneDetailPage() {
  const params = useParams()
  const [phone, setPhone] = useState<Phone | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPhone = async () => {
      try {
        const response = await fetch(`/api/phones/${params.id}`)
        if (!response.ok) {
          throw new Error('Phone not found')
        }
        const data = await response.json()
        setPhone(data)
      } catch (error) {
        console.error('Error fetching phone:', error)
        setError('Phone not found')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchPhone()
    }
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center py-32">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600"></div>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-400 to-purple-500 opacity-20 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !phone) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-32">
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-12 max-w-md mx-auto">
              <div className="text-8xl mb-6 filter grayscale opacity-60">📱</div>
              <h3 className="text-3xl font-bold text-slate-800 mb-4">Phone Not Found</h3>
              <p className="text-slate-600 leading-relaxed mb-6">The phone you're looking for doesn't exist or has been removed.</p>
              <Link
                href="/"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                ← Back to Browse
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const formatEnumValue = (value: string | null) => {
    if (!value) return 'N/A'
    return value.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
  }

  const getBooleanIcon = (value: boolean) => {
    return value ? '✅' : '❌'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Back Navigation */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-xl border border-white/30 text-slate-700 hover:bg-white hover:shadow-md transition-all duration-200"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Browse
          </Link>
        </div>

        {/* Phone Header */}
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/30 overflow-hidden mb-8">
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Phone Image */}
              <div className="flex justify-center">
                <div className="relative w-80 h-80 rounded-2xl overflow-hidden shadow-2xl">
                  {phone.image ? (
                    <Image
                      src={phone.image}
                      alt={`${phone.brand} ${phone.name}`}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                      <span className="text-8xl filter grayscale">📱</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Phone Info */}
              <div className="space-y-6">
                <div>
                  <h1 className="text-4xl font-bold text-slate-900 mb-2">
                    {phone.brand} {phone.name}
                  </h1>
                  <div className="flex items-center space-x-4 mb-4">
                    {phone.category && (
                      <span className="inline-flex px-4 py-2 text-sm font-semibold rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 text-indigo-800">
                        {formatEnumValue(phone.category)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">Price</h3>
                    <p className="text-3xl font-bold text-emerald-600">
                      {phone.price ? `$${phone.price.toLocaleString()}` : 'Price not available'}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">Rating</h3>
                    <div className="flex items-center">
                      {phone.rating ? (
                        <div className="flex items-center">
                          <span className="text-2xl text-amber-400">{'⭐'.repeat(phone.rating)}</span>
                          <span className="ml-2 text-slate-600">({phone.rating}/5)</span>
                        </div>
                      ) : (
                        <span className="text-slate-400">No rating available</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Specifications */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Basic Info */}
          <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-white/30 p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Basic Information</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="font-medium text-slate-700">Phone Shape</span>
                <span className="text-slate-600">{formatEnumValue(phone.shape)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="font-medium text-slate-700">Operating System</span>
                <span className="text-slate-600">{formatEnumValue(phone.operating_system)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="font-medium text-slate-700">Screen Type</span>
                <span className="text-slate-600">{formatEnumValue(phone.screen_type)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="font-medium text-slate-700">Keyboard Type</span>
                <span className="text-slate-600">{formatEnumValue(phone.t9_keyboard)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="font-medium text-slate-700">USB Type</span>
                <span className="text-slate-600">{formatEnumValue(phone.usb_type)}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="font-medium text-slate-700">Sold Unlocked</span>
                <span className="text-slate-600">{getBooleanIcon(Boolean(phone.sold_unlocked))}</span>
              </div>
            </div>
          </div>

          {/* Network & Connectivity */}
          <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-white/30 p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Network & Connectivity</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="font-medium text-slate-700">VoLTE Support</span>
                <span className="text-slate-600">{getBooleanIcon(Boolean(phone.volte))}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="font-medium text-slate-700">WiFi Calling</span>
                <span className="text-slate-600">{getBooleanIcon(Boolean(phone.wifi_calling))}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="font-medium text-slate-700">Hotspot/Tethering</span>
                <span className="text-slate-600">{getBooleanIcon(Boolean(phone.hotspot_tethering))}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="font-medium text-slate-700">Dual SIM Support</span>
                <span className="text-slate-600">{getBooleanIcon(Boolean(phone.dual_sim))}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="font-medium text-slate-700">eSIM Support</span>
                <span className="text-slate-600">{getBooleanIcon(Boolean(phone.esim))}</span>
              </div>

              {phone.network && (
                <div className="py-2">
                  <span className="font-medium text-slate-700">Network Capability</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {formatEnumValue(phone.network)}
                    </span>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Apps & Services */}
          <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-white/30 p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Apps & Services</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="font-medium text-slate-700">WhatsApp Support</span>
                <span className="text-slate-600">{getBooleanIcon(Boolean(phone.whatsapp))}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="font-medium text-slate-700">Spotify Compatible</span>
                <span className="text-slate-600">{getBooleanIcon(Boolean(phone.spotify))}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="font-medium text-slate-700">GPS Navigation</span>
                <span className="text-slate-600">{formatEnumValue(phone.gps_navigation)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="font-medium text-slate-700">Group Text/MMS</span>
                <span className="text-slate-600">{getBooleanIcon(Boolean(phone.group_text_mms))}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="font-medium text-slate-700">Rideshare Compatible</span>
                <span className="text-slate-600">{formatEnumValue(phone.rideshare)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="font-medium text-slate-700">Signal App Support</span>
                <span className="text-slate-600">{getBooleanIcon(Boolean(phone.signal_app))}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="font-medium text-slate-700">Email Support</span>
                <span className="text-slate-600">{getBooleanIcon(Boolean(phone.email))}</span>
              </div>
            </div>
          </div>

          {/* Hardware Features */}
          <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-white/30 p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Hardware Features</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="font-medium text-slate-700">Removable Battery</span>
                <span className="text-slate-600">{getBooleanIcon(Boolean(phone.removable_battery))}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="font-medium text-slate-700">Browser Support</span>
                <span className="text-slate-600">{getBooleanIcon(Boolean(phone.browser))}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="font-medium text-slate-700">SD Card Support</span>
                <span className="text-slate-600">{getBooleanIcon(Boolean(phone.sd_cards))}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="font-medium text-slate-700">Voice to Text</span>
                <span className="text-slate-600">{getBooleanIcon(Boolean(phone.voice_to_text))}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="font-medium text-slate-700">Headphone Jack</span>
                <span className="text-slate-600">{getBooleanIcon(Boolean(phone.headphone_jack))}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="font-medium text-slate-700">Camera</span>
                <span className="text-slate-600">{getBooleanIcon(Boolean(phone.camera))}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="font-medium text-slate-700">Calendar</span>
                <span className="text-slate-600">{getBooleanIcon(Boolean(phone.calendar))}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="font-medium text-slate-700">Touchscreen</span>
                <span className="text-slate-600">{getBooleanIcon(Boolean(phone.touchscreen))}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="font-medium text-slate-700">Android Auto</span>
                <span className="text-slate-600">{getBooleanIcon(Boolean(phone.android_auto))}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="font-medium text-slate-700">NFC Tap to Pay</span>
                <span className="text-slate-600">{getBooleanIcon(Boolean(phone.nfc_support))}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="font-medium text-slate-700">Rugged Design</span>
                <span className="text-slate-600">{getBooleanIcon(Boolean(phone.rugged))}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}