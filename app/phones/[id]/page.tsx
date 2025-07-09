'use client'

import { Phone } from '@/types/phone'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function PhoneDetailPage() {
  const params = useParams()
  const [phone, setPhone] = useState<Phone | null>(null)
  const [relatedPhones, setRelatedPhones] = useState<Phone[]>([])
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

        // Fetch related phones based on same brand or category
        const allPhonesResponse = await fetch('/api/phones')
        if (allPhonesResponse.ok) {
          const allPhones = await allPhonesResponse.json()
          const related = allPhones
            .filter((p: Phone) =>
              p.id !== data.id && // Exclude current phone
              (p.brand === data.brand || p.category === data.category) // Same brand or category
            )
            .slice(0, 4) // Limit to 4 related phones
          setRelatedPhones(related)
        }
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
              <p className="text-slate-600 leading-relaxed mb-6">The phone you&apos;re looking for doesn&apos;t exist or has been removed.</p>
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

  const formatEnumValue = (value: unknown): string => {
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
      <div className="flex items-center">
        {/* Full stars */}
        {Array.from({ length: fullStars }).map((_, i) => (
          <span key={`full-${i}`} className="text-amber-400 text-2xl">⭐</span>
        ))}

        {/* Half star */}
        {hasHalfStar && (
          <span className="relative text-2xl">
            <span className="text-gray-300">☆</span>
            <span className="absolute inset-0 text-amber-400 overflow-hidden" style={{ width: '50%' }}>
              ⭐
            </span>
          </span>
        )}

        {/* Empty stars */}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <span key={`empty-${i}`} className="text-gray-300 text-2xl">☆</span>
        ))}
      </div>
    )
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

                  {/* Description */}
                  {phone.description && (
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                      <h3 className="text-lg font-semibold text-slate-800 mb-2">Description</h3>
                      <p className="text-slate-700 leading-relaxed">{phone.description}</p>
                    </div>
                  )}
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
                          <span className="text-2xl text-amber-400">{renderStars(phone.rating)}</span>
                          <span className="ml-2 text-slate-600">({phone.rating.toFixed(1)}/5)</span>
                        </div>
                      ) : (
                        <span className="text-slate-400">No rating available</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Buy Button */}
                {phone.link && (
                  <div className="mt-6">
                    <a
                      href={phone.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white text-lg font-bold rounded-xl hover:from-emerald-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
                    >
                      🛒 Buy Now
                      <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-1M14 6a2 2 0 002 2v1m-6 8a2 2 0 002-2v-1M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m-6 8h6M8 6a2 2 0 012-2h4a2 2 0 012 2v2m-6 8h6" />
                      </svg>
                    </a>
                  </div>
                )}
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

        {/* Search Links Section */}
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-white/30 p-8 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Search for More Info</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* YouTube */}
            <a
              href={`https://www.youtube.com/results?search_query=${encodeURIComponent(`${phone.brand} ${phone.name} review`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center p-4 bg-red-50 hover:bg-red-100 rounded-xl border border-red-200 transition-all duration-200 group"
            >
              <div className="text-center">
                <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">
                  🎥
                </div>
                <span className="text-sm font-medium text-red-700">YouTube</span>
              </div>
            </a>

            {/* Google */}
            <a
              href={`https://www.google.com/search?q=${encodeURIComponent(`${phone.brand} ${phone.name} specs review`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center p-4 bg-blue-50 hover:bg-blue-100 rounded-xl border border-blue-200 transition-all duration-200 group"
            >
              <div className="text-center">
                <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">
                  🔍
                </div>
                <span className="text-sm font-medium text-blue-700">Google</span>
              </div>
            </a>

            {/* Amazon */}
            <a
              href={`https://www.amazon.com/s?k=${encodeURIComponent(`${phone.brand} ${phone.name}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center p-4 bg-orange-50 hover:bg-orange-100 rounded-xl border border-orange-200 transition-all duration-200 group"
            >
              <div className="text-center">
                <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">
                  📦
                </div>
                <span className="text-sm font-medium text-orange-700">Amazon</span>
              </div>
            </a>

            {/* eBay */}
            <a
              href={`https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(`${phone.brand} ${phone.name}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center p-4 bg-yellow-50 hover:bg-yellow-100 rounded-xl border border-yellow-200 transition-all duration-200 group"
            >
              <div className="text-center">
                <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">
                  🛒
                </div>
                <span className="text-sm font-medium text-yellow-700">eBay</span>
              </div>
            </a>
          </div>
        </div>

        {/* Related Phones Section */}
        {relatedPhones.length > 0 && (
          <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-white/30 p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Related Phones</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedPhones.map((relatedPhone) => (
                <div
                  key={relatedPhone.id}
                  className="bg-slate-50 rounded-xl p-4 hover:bg-white hover:shadow-md transition-all duration-200 cursor-pointer border border-slate-200"
                  onClick={() => window.location.href = `/phones/${relatedPhone.id}`}
                >
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-3 relative">
                      {relatedPhone.image ? (
                        <Image
                          src={relatedPhone.image}
                          alt={`${relatedPhone.brand} ${relatedPhone.name}`}
                          fill
                          className="object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center">
                          <span className="text-2xl">📱</span>
                        </div>
                      )}
                    </div>
                    <h3 className="font-bold text-slate-800 text-sm mb-1">{relatedPhone.brand}</h3>
                    <p className="text-slate-600 text-xs mb-2">{relatedPhone.name}</p>
                    <p className="text-emerald-600 font-semibold text-sm">
                      {relatedPhone.price ? `$${parseFloat(relatedPhone.price).toLocaleString()}` : 'Price N/A'}
                    </p>
                    {relatedPhone.rating && (
                      <div className="mt-2">
                        <span className="text-amber-400 text-sm">{renderStars(relatedPhone.rating)}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}