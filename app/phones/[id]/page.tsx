import { Phone } from '@/types/phone'
import Image from 'next/image'
import Link from 'next/link'
import { ReactNode } from 'react'
import { db, phone } from '@/lib/db'
import { eq, or, and, not, desc } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'

interface PhoneDetailPageProps {
  params: Promise<{ id: string }>
}

// Generate static params for popular phones
export async function generateStaticParams() {
  try {
    const popularPhones = await db.select({ id: phone.id, slug: phone.slug }).from(phone)
      .where(eq(phone.featured, true))
      .orderBy(desc(phone.rating))
      .limit(50)
    
    return popularPhones.map((p) => ({
      id: p.slug || p.id.toString(),
    }))
  } catch (error) {
    console.error('Error generating static params:', error)
    return []
  }
}

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: PhoneDetailPageProps): Promise<Metadata> {
  const resolvedParams = await params
  const phoneData = await getPhoneData(resolvedParams.id)
  
  if (!phoneData) {
    return {
      title: 'Phone Not Found',
      description: 'The phone you are looking for could not be found.',
    }
  }
  
  const title = `${phoneData.brand} ${phoneData.name} - Flip Phone Finder`
  const description = phoneData.description || 
    `Discover the ${phoneData.brand} ${phoneData.name} - a ${phoneData.category} phone with ${phoneData.operating_system} OS. Find specs, reviews, and where to buy.`
  
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      images: phoneData.image ? [phoneData.image] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: phoneData.image ? [phoneData.image] : undefined,
    },
  }
}

async function getPhoneData(identifier: string): Promise<Phone | null> {
  try {
    const phoneId = parseInt(identifier)
    let result
    
    if (!isNaN(phoneId)) {
      // If it's a valid number, search by ID
      result = await db.select().from(phone).where(eq(phone.id, phoneId))
    } else {
      // If it's not a number, search by slug
      result = await db.select().from(phone).where(eq(phone.slug, identifier))
    }
    
    // If no result found and identifier is not a number, try both slug and ID
    if (result.length === 0) {
      result = await db.select().from(phone).where(
        or(
          eq(phone.slug, identifier),
          isNaN(phoneId) ? eq(phone.id, -1) : eq(phone.id, phoneId)
        )
      )
    }
    
    return result.length > 0 ? result[0] : null
  } catch (error) {
    console.error('Error fetching phone:', error)
    return null
  }
}

async function getRelatedPhones(currentPhone: Phone): Promise<Phone[]> {
  try {
    const conditions = []
    
    if (currentPhone.brand) {
      conditions.push(eq(phone.brand, currentPhone.brand))
    }
    
    if (currentPhone.category) {
      conditions.push(eq(phone.category, currentPhone.category))
    }
    
    if (conditions.length === 0) {
      return []
    }
    
    const related = await db.select().from(phone).where(
      and(
        not(eq(phone.id, currentPhone.id)),
        or(...conditions)
      )
    ).limit(4)
    
    return related
  } catch (error) {
    console.error('Error fetching related phones:', error)
    return []
  }
}

export default async function PhoneDetailPage({ params }: PhoneDetailPageProps) {
  const resolvedParams = await params
  const phoneData = await getPhoneData(resolvedParams.id)
  
  if (!phoneData) {
    notFound()
  }
  
  const relatedPhones = await getRelatedPhones(phoneData)


  const formatEnumValue = (value: unknown): ReactNode => {
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

  const hasValue = (value: unknown): boolean => {
    return value !== null && value !== undefined && value !== ''
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
                  {phoneData.image ? (
                    <Image
                      src={phoneData.image}
                      alt={`${phoneData.brand} ${phoneData.name}`}
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
                    {phoneData.brand} {phoneData.name}
                  </h1>
                  <div className="flex items-center space-x-4 mb-4">
                    {hasValue(phoneData.category) && (
                      <span className="inline-flex px-4 py-2 text-sm font-semibold rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 text-indigo-800">
                        {formatEnumValue(phoneData.category)}
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  {phoneData.description && (
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                      <h3 className="text-lg font-semibold text-slate-800 mb-2">Description</h3>
                      <p className="text-slate-700 leading-relaxed">{phoneData.description}</p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">Price</h3>
                    <p className="text-3xl font-bold text-emerald-600">
                      {phoneData.price ? `$${phoneData.price.toLocaleString()}` : 'Price not available'}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">Rating</h3>
                    <div className="flex items-center">
                      {phoneData.rating ? (
                        <div className="flex items-center">
                          <span className="text-2xl text-amber-400">{renderStars(phoneData.rating)}</span>
                          <span className="ml-2 text-slate-600">({phoneData.rating.toFixed(1)}/5)</span>
                        </div>
                      ) : (
                        <span className="text-slate-400">No rating available</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Buy Button */}
                {phoneData.link && (
                  <div className="mt-6">
                    <a
                      href={phoneData.link}
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
                <span className="text-slate-600">{formatEnumValue(phoneData.shape)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="font-medium text-slate-700">Operating System</span>
                <span className="text-slate-600">{formatEnumValue(phoneData.operating_system)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="font-medium text-slate-700">Screen Type</span>
                <span className="text-slate-600">{formatEnumValue(phoneData.screen_type)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="font-medium text-slate-700">Keyboard Type</span>
                <span className="text-slate-600">{formatEnumValue(phoneData.t9_keyboard)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="font-medium text-slate-700">USB Type</span>
                <span className="text-slate-600">{formatEnumValue(phoneData.usb_type)}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="font-medium text-slate-700">Sold Unlocked</span>
                <span className="text-slate-600">{getBooleanIcon(Boolean(phoneData.sold_unlocked))}</span>
              </div>
            </div>
          </div>

          {/* Network & Connectivity */}
          <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-white/30 p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Network & Connectivity</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="font-medium text-slate-700">VoLTE Support</span>
                <span className="text-slate-600">{getBooleanIcon(Boolean(phoneData.volte))}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="font-medium text-slate-700">WiFi Calling</span>
                <span className="text-slate-600">{getBooleanIcon(Boolean(phoneData.wifi_calling))}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="font-medium text-slate-700">Hotspot/Tethering</span>
                <span className="text-slate-600">{getBooleanIcon(Boolean(phoneData.hotspot_tethering))}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="font-medium text-slate-700">Dual SIM Support</span>
                <span className="text-slate-600">{getBooleanIcon(Boolean(phoneData.dual_sim))}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="font-medium text-slate-700">eSIM Support</span>
                <span className="text-slate-600">{getBooleanIcon(Boolean(phoneData.esim))}</span>
              </div>

              {hasValue(phoneData.network) && (
                <div className="py-2">
                  <span className="font-medium text-slate-700">Network Compatibility</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {(() => {
                      const getCarrierInfo = (carrier: string) => {
                        const lowerCarrier = carrier.toLowerCase().trim()
                        
                        // Verizon - Red
                        if (lowerCarrier.includes('verizon')) {
                          return {
                            name: 'Verizon',
                            color: 'bg-red-100 text-red-800 border-red-200'
                          }
                        }
                        
                        // AT&T - Blue
                        if (lowerCarrier.includes('at&t') || lowerCarrier.includes('att')) {
                          return {
                            name: 'AT&T',
                            color: 'bg-blue-100 text-blue-800 border-blue-200'
                          }
                        }
                        
                        // T-Mobile - Magenta/Pink
                        if (lowerCarrier.includes('t-mobile') || lowerCarrier.includes('tmobile')) {
                          return {
                            name: 'T-Mobile',
                            color: 'bg-pink-100 text-pink-800 border-pink-200'
                          }
                        }
                        
                        // Sprint - Yellow
                        if (lowerCarrier.includes('sprint')) {
                          return {
                            name: 'Sprint',
                            color: 'bg-yellow-100 text-yellow-800 border-yellow-200'
                          }
                        }
                        
                        // US Cellular - Green
                        if (lowerCarrier.includes('us cellular') || lowerCarrier.includes('uscellular')) {
                          return {
                            name: 'US Cellular',
                            color: 'bg-green-100 text-green-800 border-green-200'
                          }
                        }
                        
                        // Cricket - Orange
                        if (lowerCarrier.includes('cricket')) {
                          return {
                            name: 'Cricket Wireless',
                            color: 'bg-orange-100 text-orange-800 border-orange-200'
                          }
                        }
                        
                        // Mint Mobile - Green
                        if (lowerCarrier.includes('mint')) {
                          return {
                            name: 'Mint Mobile',
                            color: 'bg-emerald-100 text-emerald-800 border-emerald-200'
                          }
                        }
                        
                        // Visible - Purple
                        if (lowerCarrier.includes('visible')) {
                          return {
                            name: 'Visible',
                            color: 'bg-purple-100 text-purple-800 border-purple-200'
                          }
                        }
                        
                        // Unlocked/GSM/CDMA - Gray
                        if (lowerCarrier.includes('unlocked')) {
                          return {
                            name: 'Unlocked',
                            color: 'bg-gray-100 text-gray-800 border-gray-200'
                          }
                        }
                        
                        if (lowerCarrier.includes('gsm')) {
                          return {
                            name: 'GSM',
                            color: 'bg-gray-100 text-gray-800 border-gray-200'
                          }
                        }
                        
                        if (lowerCarrier.includes('cdma')) {
                          return {
                            name: 'CDMA',
                            color: 'bg-gray-100 text-gray-800 border-gray-200'
                          }
                        }
                        
                        // Default - return original with proper formatting
                        return {
                          name: carrier.charAt(0).toUpperCase() + carrier.slice(1),
                          color: 'bg-slate-100 text-slate-800 border-slate-200'
                        }
                      }
                      
                      const networkValue = formatEnumValue(phoneData.network)
                      const networks = typeof networkValue === 'string' 
                        ? networkValue.split(',').map(n => n.trim()).filter(n => n.length > 0)
                        : [networkValue]
                      
                      return networks.map((network, index) => {
                        const carrierInfo = getCarrierInfo(String(network))
                        return (
                          <span
                            key={index}
                            className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${carrierInfo.color}`}
                          >
                            {carrierInfo.name}
                          </span>
                        )
                      })
                    })()}
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
                <span className="text-slate-600">{getBooleanIcon(Boolean(phoneData.whatsapp))}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="font-medium text-slate-700">Spotify Compatible</span>
                <span className="text-slate-600">{getBooleanIcon(Boolean(phoneData.spotify))}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="font-medium text-slate-700">GPS Navigation</span>
                <span className="text-slate-600">{formatEnumValue(phoneData.gps_navigation)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="font-medium text-slate-700">Group Text/MMS</span>
                <span className="text-slate-600">{getBooleanIcon(Boolean(phoneData.group_text_mms))}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="font-medium text-slate-700">Rideshare Compatible</span>
                <span className="text-slate-600">{formatEnumValue(phoneData.rideshare)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="font-medium text-slate-700">Signal App Support</span>
                <span className="text-slate-600">{getBooleanIcon(Boolean(phoneData.signal_app))}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="font-medium text-slate-700">Email Support</span>
                <span className="text-slate-600">{getBooleanIcon(Boolean(phoneData.email))}</span>
              </div>
            </div>
          </div>

          {/* Hardware Features */}
          <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-white/30 p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Hardware Features</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="font-medium text-slate-700">Removable Battery</span>
                <span className="text-slate-600">{getBooleanIcon(Boolean(phoneData.removable_battery))}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="font-medium text-slate-700">Browser Support</span>
                <span className="text-slate-600">{getBooleanIcon(Boolean(phoneData.browser))}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="font-medium text-slate-700">SD Card Support</span>
                <span className="text-slate-600">{getBooleanIcon(Boolean(phoneData.sd_cards))}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="font-medium text-slate-700">Voice to Text</span>
                <span className="text-slate-600">{getBooleanIcon(Boolean(phoneData.voice_to_text))}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="font-medium text-slate-700">Headphone Jack</span>
                <span className="text-slate-600">{getBooleanIcon(Boolean(phoneData.headphone_jack))}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="font-medium text-slate-700">Camera</span>
                <span className="text-slate-600">{getBooleanIcon(Boolean(phoneData.camera))}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="font-medium text-slate-700">Calendar</span>
                <span className="text-slate-600">{getBooleanIcon(Boolean(phoneData.calendar))}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="font-medium text-slate-700">Touchscreen</span>
                <span className="text-slate-600">{getBooleanIcon(Boolean(phoneData.touchscreen))}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="font-medium text-slate-700">Android Auto</span>
                <span className="text-slate-600">{getBooleanIcon(Boolean(phoneData.android_auto))}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="font-medium text-slate-700">NFC Tap to Pay</span>
                <span className="text-slate-600">{getBooleanIcon(Boolean(phoneData.nfc_support))}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="font-medium text-slate-700">Rugged Design</span>
                <span className="text-slate-600">{getBooleanIcon(Boolean(phoneData.rugged))}</span>
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
              href={`https://www.youtube.com/results?search_query=${encodeURIComponent(`${phoneData.brand} ${phoneData.name} review`)}`}
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
              href={`https://www.google.com/search?q=${encodeURIComponent(`${phoneData.brand} ${phoneData.name} specs review`)}`}
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
              href={`https://www.amazon.com/s?k=${encodeURIComponent(`${phoneData.brand} ${phoneData.name}`)}`}
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
              href={`https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(`${phoneData.brand} ${phoneData.name}`)}`}
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
                <Link
                  key={relatedPhone.id}
                  href={`/phones/${relatedPhone.slug || relatedPhone.id}`}
                  className="block bg-slate-50 rounded-xl p-4 hover:bg-white hover:shadow-md transition-all duration-200 cursor-pointer border border-slate-200"
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
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}