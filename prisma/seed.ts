import { PrismaClient, Category, PhoneShape, GpsNavigation, RideshareCompat, OperatingSystem, KeyboardType, UsbType, ScreenType, PodcastsMusicSupport, SupportUpdates } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')
  
  // Read CSV file
  const csvPath = path.join(process.cwd(), 'data', 'flip-phones.csv')
  const csvContent = fs.readFileSync(csvPath, 'utf-8')
  
  // Parse CSV (simple parser for our specific format)
  const lines = csvContent.split('\n')
  const headers = lines[0].split(',')
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue
    
    const values = line.split(',')
    
    // Handle quoted values with commas
    const cleanValues = []
    let currentValue = ''
    let inQuotes = false
    
    for (let j = 0; j < line.length; j++) {
      const char = line[j]
      if (char === '"' && (j === 0 || line[j-1] === ',')) {
        inQuotes = true
      } else if (char === '"' && (j === line.length - 1 || line[j+1] === ',')) {
        inQuotes = false
      } else if (char === ',' && !inQuotes) {
        cleanValues.push(currentValue.trim())
        currentValue = ''
        continue
      }
      
      if (!(char === '"' && (j === 0 || line[j-1] === ',' || j === line.length - 1 || line[j+1] === ','))) {
        currentValue += char
      }
    }
    cleanValues.push(currentValue.trim())
    
    const phoneData = {
      brand: cleanValues[0],
      model: cleanValues[1],
      price: cleanValues[2] ? parseFloat(cleanValues[2]) : null,
      condition: cleanValues[3],
      description: cleanValues[4] || null,
      imageUrl: cleanValues[5] || null,
      category: Category.DUMBPHONE,
      phoneShape: PhoneShape.FLIP,
      gpsNavigation: GpsNavigation.NO,
      rideshareCompat: RideshareCompat.NO,
      operatingSystem: OperatingSystem.THREADX,
      keyboardType: KeyboardType.T9,
      usbType: UsbType.MICRO_USB,
      screenType: ScreenType.LCD,
      podcastsMusicSupport: PodcastsMusicSupport.NO,
      supportUpdates: SupportUpdates.NOT_RELIABLE,
    }
    
    try {
      await prisma.phone.create({
        data: phoneData
      })
      console.log(`Created phone: ${phoneData.brand} ${phoneData.model}`)
    } catch (error) {
      console.error(`Error creating phone ${phoneData.brand} ${phoneData.model}:`, error)
    }
  }
  
  console.log('Seeding completed!')
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