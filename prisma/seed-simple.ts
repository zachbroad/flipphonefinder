import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Sample of your data with Amazon links removed and jose_ratings renamed to rating
const dumbphones = [
  {
    "name": "AGM M8",
    "link": "",
    "price": 90,
    "rating": "⭐️⭐️⭐️",
    "image": "https://images.squarespace-cdn.com/content/64d509b6fc7327768c9807a2/06421bb5-1704-4787-9dbe-c72509b60075/Design+5+%281%29.png?content-type=image%2Fpng"
  },
  {
    "name": "AGM M7", 
    "link": "https://dumbwireless.com/?ref=JOSEBRIONES",
    "price": 140,
    "rating": "⭐️⭐️⭐️",
    "image": "https://images.squarespace-cdn.com/content/64d509b6fc7327768c9807a2/ff8eacfc-0346-492e-8ed4-0c67dced156c/Design+5.png?content-type=image%2Fpng"
  },
  {
    "name": "Alcatel Go Flip 3",
    "link": "",
    "price": 50,
    "rating": "⭐️⭐️⭐️",
    "image": "https://images.squarespace-cdn.com/content/64d509b6fc7327768c9807a2/51693004-41c2-4429-986e-49a9cdc0c2e0/Design+5+%283%29.png?content-type=image%2Fpng"
  },
  {
    "name": "Alcatel Go Flip 4",
    "link": "",
    "price": 50,
    "rating": "⭐️⭐️⭐️",
    "image": "https://images.squarespace-cdn.com/content/64d509b6fc7327768c9807a2/dce01d4d-577c-46a0-8216-ecb49b5557ff/Design+5+%284%29.png?content-type=image%2Fpng"
  },
  {
    "name": "Light Phone 3",
    "link": "https://www.thelightphone.com/shop?ref=josebriones",
    "price": 599,
    "rating": "⭐️⭐️⭐️⭐️⭐️",
    "image": "https://images.squarespace-cdn.com/content/64d509b6fc7327768c9807a2/436e0151-7cbd-4fd1-9dce-97a823052591/Designer+%2811%29.png?content-type=image%2Fpng"
  },
  {
    "name": "Samsung Galaxy Z Flip 6",
    "link": "",
    "price": 999,
    "rating": "⭐️⭐️⭐️⭐️⭐️",
    "image": "https://images.samsung.com/is/image/samsung/p6pim/us/2407/gallery/us-galaxy-z-flip6-f741-zflip6-gallery-cover-mint-thumbnails-535x535.jpg"
  },
  {
    "name": "Motorola Razr Plus 2024",
    "link": "",
    "price": 999,
    "rating": "⭐️⭐️⭐️⭐️⭐️",
    "image": "https://motorola-global-portal-de.cdn.celum.cloud/9df3ac3cfe8e3e66/assets/blt3cb9d8d4c3ff5b1f/source/motorola-razr-plus-2024-hero.png"
  },
  {
    "name": "Nokia 2780",
    "link": "https://dumbwireless.com/?ref=JOSEBRIONES",
    "price": 89,
    "rating": "⭐️⭐️⭐️⭐️⭐️",
    "image": "https://images.squarespace-cdn.com/content/64d509b6fc7327768c9807a2/5de70aa1-ad9d-4b94-b551-a21c36cbecb6/Designer+%2849%29.png?content-type=image%2Fpng"
  },
  {
    "name": "Kyocera Dura XV Extreme",
    "link": "",
    "price": 299,
    "rating": "⭐️⭐️⭐️⭐️⭐️",
    "image": "https://images.squarespace-cdn.com/content/64d509b6fc7327768c9807a2/9c1e0102-1bff-414a-a06f-e53c17c661b9/Designer+%288%29.png?content-type=image%2Fpng"
  },
  {
    "name": "Punkt MP02",
    "link": "https://dumbwireless.com/?ref=JOSEBRIONES",
    "price": 299,
    "rating": "⭐️⭐️⭐️⭐️",
    "image": "https://images.squarespace-cdn.com/content/64d509b6fc7327768c9807a2/7d2bc526-beee-4945-8f53-0fbfc75ac4c2/Designer+%2836%29.png?content-type=image%2Fpng"
  }
]

async function main() {
  console.log('Seeding database with dumbphone data...')
  
  // Clear existing data
  await prisma.phone.deleteMany({})
  console.log('Cleared existing phone data')
  
  let count = 0
  
  for (const phone of dumbphones) {
    try {
      // Extract brand and model from name
      const nameParts = phone.name.split(' ')
      const brand = nameParts[0]
      const model = nameParts.slice(1).join(' ')
      
      const phoneData = {
        brand: brand,
        model: model || phone.name,
        price: phone.price && typeof phone.price === 'number' ? phone.price : null,
        condition: 'New',
        description: `${phone.rating} rated phone`,
        imageUrl: phone.image || null
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