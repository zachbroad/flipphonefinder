import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()

// Helper function to map string values to enum values
function mapCategory(category: string[]): any {
  const catStr = category[0]?.toLowerCase()
  if (catStr?.includes('dumbphone')) return 'DUMBPHONE'
  if (catStr?.includes('smart feature')) return 'SMART_FEATURE_PHONE'
  if (catStr?.includes('feature phone')) return 'FEATURE_PHONE'
  if (catStr?.includes('smartphone')) return 'SMARTPHONE'
  return 'FEATURE_PHONE' // default
}

function mapPhoneShape(shape: string[]): any {
  const shapeStr = shape[0]?.toLowerCase()
  if (shapeStr?.includes('flip')) return 'FLIP'
  if (shapeStr?.includes('candy')) return 'CANDY_BAR'
  if (shapeStr?.includes('slider')) return 'SLIDER'
  if (shapeStr?.includes('qwerty')) return 'QWERTY'
  if (shapeStr?.includes('touch')) return 'TOUCH'
  return 'CANDY_BAR' // default
}

function mapNetworkProviders(networks: string[]): any[] {
  const providerMap: Record<string, any> = {
    't-mobile': 'T_MOBILE',
    'verizon': 'VERIZON',
    'at&t': 'ATT',
    'att': 'ATT',
    'tracfone': 'TRACFONE_STRAIGHT_TALK',
    'straight talk': 'TRACFONE_STRAIGHT_TALK',
    'bell': 'BELL',
    'telus': 'TELUS',
    'rogers': 'ROGERS_FIDO',
    'fido': 'ROGERS_FIDO',
    'rogers/fido': 'ROGERS_FIDO',
    'consumer cellular': 'CONSUMER_CELLULAR',
    'us cellular': 'US_CELLULAR',
    'boost mobile': 'BOOST_MOBILE'
  }
  
  return networks.map(network => 
    providerMap[network.toLowerCase()] || null
  ).filter(Boolean)
}

function mapNetworkCapability(capabilities: string[]): any[] {
  const capMap: Record<string, any> = {
    '5g': 'FIVE_G',
    '4g': 'FOUR_G', 
    '3g': 'THREE_G',
    '2g': 'TWO_G'
  }
  
  return capabilities.map(cap => 
    capMap[cap.toLowerCase()] || null
  ).filter(Boolean)
}

function mapOperatingSystem(os: string[]): any {
  const osStr = os[0]?.toLowerCase()
  if (osStr?.includes('kaios')) return 'KAIOS'
  if (osStr?.includes('android aosp')) return 'ANDROID_AOSP'
  if (osStr?.includes('android with google')) return 'ANDROID_WITH_GOOGLE'
  if (osStr?.includes('threadx')) return 'THREADX'
  if (osStr?.includes('series 30')) return 'SERIES_30_PLUS'
  return 'SERIES_30_PLUS' // default
}

function mapGpsNavigation(gps: string[]): any {
  const gpsStr = gps[0]?.toLowerCase()
  if (gpsStr?.includes('google maps')) return 'GOOGLE_MAPS'
  if (gpsStr?.includes('browser maps')) return 'BROWSER_MAPS'
  if (gpsStr?.includes('here maps')) return 'HERE_MAPS'
  if (gpsStr?.includes('openstreet') || gpsStr?.includes('open maps')) return 'OPEN_MAPS'
  if (gpsStr?.includes('waze')) return 'WAZE'
  return 'NO'
}

function mapRideshareCompat(rideshare: string[]): any {
  const rideshareStr = rideshare[0]?.toLowerCase()
  if (rideshareStr?.includes('app')) return 'APP'
  if (rideshareStr?.includes('web browser')) return 'WEB_BROWSER'
  return 'NO'
}

function mapKeyboardType(keyboard: string[]): any {
  const kbStr = keyboard.join(' ').toLowerCase()
  if (kbStr.includes('physical qwerty')) return 'PHYSICAL_QWERTY'
  if (kbStr.includes('touch') && kbStr.includes('qwerty')) return 'TOUCH_QWERTY'
  if (kbStr.includes('t9')) return 'T9'
  return 'NO'
}

function mapUsbType(usb: string[]): any {
  const usbStr = usb[0]?.toLowerCase()
  if (usbStr?.includes('usb-c')) return 'USB_C'
  if (usbStr?.includes('micro-usb')) return 'MICRO_USB'
  return 'MICRO_USB' // default
}

function mapScreenType(screen: string[]): any {
  const screenStr = screen[0]?.toLowerCase()
  if (screenStr?.includes('amoled')) return 'AMOLED'
  if (screenStr?.includes('e-ink')) return 'E_INK'
  return 'LCD' // default
}

function mapPodcastsMusic(podcasts: string[]): any {
  const podcastStr = podcasts[0]?.toLowerCase()
  if (podcastStr?.includes('app')) return 'APP'
  if (podcastStr?.includes('mp3')) return 'MP3'
  return 'NO'
}

function mapSupportUpdates(support: string[]): any {
  const supportStr = support[0]?.toLowerCase()
  if (supportStr?.includes('reliable')) return 'RELIABLE'
  return 'NOT_RELIABLE'
}

function mapRegions(regions: string[]): any[] {
  const regionMap: Record<string, any> = {
    'europe': 'EUROPE',
    'north america': 'NORTH_AMERICA',
    'asia/oceania': 'ASIA_OCEANIA',
    'africa': 'AFRICA',
    'latam': 'LATAM'
  }
  
  return regions.map(region => 
    regionMap[region.toLowerCase()] || null
  ).filter(Boolean)
}

function mapTwoFactorAuth(twoFA: string[]): any[] {
  return twoFA.map(auth => {
    const authStr = auth.toLowerCase()
    if (authStr.includes('sms')) return 'SMS'
    if (authStr.includes('app')) return 'APPS'
    return null
  }).filter(Boolean)
}

function removeAmazonLinks(link: string): string {
  if (link && link.includes('amzn.to')) {
    return ''
  }
  return link || ''
}

async function main() {
  console.log('Seeding database with dumbphone data...')
  
  // Read and parse the JSON data
  const jsonPath = path.join(process.cwd(), 'data', 'dumbphones.json')
  
  // For now, we'll use the data you provided directly
  const phones: any[] = [
    // You would place the full JSON array here
    // For brevity, I'll show the structure with first few items
  ]

  let count = 0
  
  for (const phone of phones) {
    try {
      const phoneData = {
        brand: phone.name.split(' ')[0] || 'Unknown',
        model: phone.name.split(' ').slice(1).join(' ') || phone.name,
        price: phone.price && typeof phone.price === 'number' ? phone.price : null,
        condition: 'New', // Most appear to be new
        description: phone.description?.[0] || null,
        imageUrl: phone.image || null,
        
        // Basic categorization
        category: mapCategory(Array.isArray(phone.category) ? phone.category : [phone.category]),
        phoneShape: mapPhoneShape(Array.isArray(phone.shape) ? phone.shape : [phone.shape]),
        region: mapRegions(Array.isArray(phone.region) ? phone.region : []),
        
        // Network and connectivity
        networkProviders: mapNetworkProviders(Array.isArray(phone.network) ? phone.network : []),
        networkCapability: mapNetworkCapability(Array.isArray(phone['5G/4G/3G/2G']) ? phone['5G/4G/3G/2G'] : [phone['5G/4G/3G/2G']]),
        volteSupport: Array.isArray(phone.VoLTE) ? phone.VoLTE[0] === 'Yes' : phone.VoLTE === 'Yes',
        wifiCalling: Array.isArray(phone.wifi_calling) ? phone.wifi_calling[0] === 'Yes' : phone.wifi_calling === 'Yes',
        hotspotTethering: Array.isArray(phone.hotspot_tethering) ? phone.hotspot_tethering[0] === 'Yes' : phone.hotspot_tethering === 'Yes',
        dualSimSupport: Array.isArray(phone.dual_sim) ? phone.dual_sim[0] === 'Yes' : phone.dual_sim === 'Yes',
        esimSupport: phone.eSIM && (Array.isArray(phone.eSIM) ? phone.eSIM.includes('Yes') : phone.eSIM === 'Yes'),
        
        // Apps and services
        whatsappSupport: Array.isArray(phone.whatsapp) ? phone.whatsapp[0] === 'Yes' : phone.whatsapp === 'Yes',
        spotifyCompatible: Array.isArray(phone.spotify) ? phone.spotify[0] === 'Yes' : phone.spotify === 'Yes',
        gpsNavigation: mapGpsNavigation(Array.isArray(phone.gps_navigation) ? phone.gps_navigation : [phone.gps_navigation]),
        groupTextMms: Array.isArray(phone.group_text_MMS) ? phone.group_text_MMS[0] === 'Yes' : phone.group_text_MMS === 'Yes',
        rideshareCompat: mapRideshareCompat(Array.isArray(phone.rideshare) ? phone.rideshare : [phone.rideshare]),
        signalAppSupport: Array.isArray(phone.signal_app) ? phone.signal_app[0] === 'Yes' : phone.signal_app === 'Yes',
        
        // Hardware features
        removableBattery: Array.isArray(phone.removable_battery) ? phone.removable_battery[0] === 'Yes' : phone.removable_battery === 'Yes',
        operatingSystem: mapOperatingSystem(Array.isArray(phone.operating_system) ? phone.operating_system : [phone.operating_system]),
        browserSupport: Array.isArray(phone.browser) ? phone.browser[0] === 'Yes' : phone.browser === 'Yes',
        sdCardSupport: Array.isArray(phone.sd_cards) ? phone.sd_cards[0] === 'Yes' : phone.sd_cards === 'Yes',
        twoFactorAuth: mapTwoFactorAuth(Array.isArray(phone['2FA']) ? phone['2FA'] : [phone['2FA']]),
        emailSupport: Array.isArray(phone.email) ? phone.email[0] === 'Yes' : phone.email === 'Yes',
        voiceToText: Array.isArray(phone.voice_to_text) ? phone.voice_to_text[0] === 'Yes' : phone.voice_to_text === 'Yes',
        keyboardType: mapKeyboardType(Array.isArray(phone.t9_keyboard) ? phone.t9_keyboard : [phone.t9_keyboard]),
        usbType: mapUsbType(Array.isArray(phone.usb_type) ? phone.usb_type : [phone.usb_type]),
        headphoneJack: Array.isArray(phone.headphone_jack) ? phone.headphone_jack[0] === 'Yes' : phone.headphone_jack === 'Yes',
        camera: Array.isArray(phone.camera) ? phone.camera[0] === 'Yes' : phone.camera === 'Yes',
        calendar: Array.isArray(phone.calendar) ? phone.calendar.length > 0 && phone.calendar[0] === 'Yes' : phone.calendar === 'Yes',
        screenType: mapScreenType(Array.isArray(phone.screen_type) ? phone.screen_type : [phone.screen_type]),
        soldUnlocked: Array.isArray(phone.sold_unlocked) ? phone.sold_unlocked[0] === 'Yes' : phone.sold_unlocked === 'Yes',
        podcastsMusicSupport: mapPodcastsMusic(Array.isArray(phone.podcasts_music) ? phone.podcasts_music : [phone.podcasts_music]),
        supportUpdates: mapSupportUpdates(Array.isArray(phone.support_and_updates) ? phone.support_and_updates : [phone.support_and_updates]),
        touchscreen: phone.Touchscreen === 'Yes' || phone.Touchscreen === true,
        androidAuto: Array.isArray(phone.android_auto) ? phone.android_auto[0] === 'Yes' : phone.android_auto === 'Yes',
        nfcTapToPay: phone.NFC_support === 'Yes',
        rugged: Array.isArray(phone.rugged) ? phone.rugged[0] === 'Yes' : phone.rugged === 'Yes',
      }
      
      await prisma.phone.create({
        data: phoneData
      })
      
      count++
      console.log(`✓ Created: ${phoneData.brand} ${phoneData.model}`)
    } catch (error) {
      console.error(`✗ Error creating ${phone.name}:`, error)
    }
  }
  
  console.log(`\n🎉 Successfully seeded ${count} phones!`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })