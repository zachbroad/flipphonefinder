const { drizzle } = require('drizzle-orm/node-postgres')
const { Pool } = require('pg')
const { eq } = require('drizzle-orm')

// Load environment variables
require('dotenv').config()

// Initialize database connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
})

// Define the phone table schema
const { pgTable, text, integer, boolean, doublePrecision, jsonb, timestamp, index } = require('drizzle-orm/pg-core')

const phone = pgTable('phone', {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    name: text('name'),
    image: text('image'),
    brand: text('brand'),
    price: text('price'),
    // Add other fields as needed
}, (table) => ({
    idIndex: index('dump_id_index').on(table.id),
}))

const db = drizzle(pool, { schema: { phone } })

async function testConnection() {
    try {
        console.log('🔍 Testing database connection...')

        // Get total count
        const totalPhones = await db.select({ count: phone.id }).from(phone)
        console.log(`📱 Total phones in database: ${totalPhones.length}`)

        // Get first 5 phones with their image status
        const samplePhones = await db.select({
            id: phone.id,
            name: phone.name,
            brand: phone.brand,
            image: phone.image,
            price: phone.price
        }).from(phone).limit(5)

        console.log('\n📋 Sample phones:')
        samplePhones.forEach(p => {
            const imageStatus = p.image ?
                (p.image.startsWith('http') ? '🌐 External URL' : '📁 Local/Supabase') :
                '❌ No image'
            console.log(`  ${p.id}. ${p.brand} ${p.name} - ${imageStatus}`)
            if (p.image) console.log(`     Image: ${p.image.substring(0, 60)}...`)
        })

        // Count phones with images
        const phonesWithImages = await db.select({
            id: phone.id,
            image: phone.image
        }).from(phone)

        const externalImages = phonesWithImages.filter(p => p.image && p.image.startsWith('http')).length
        const localImages = phonesWithImages.filter(p => p.image && !p.image.startsWith('http')).length
        const noImages = phonesWithImages.filter(p => !p.image).length

        console.log('\n📊 Image status summary:')
        console.log(`  🌐 External URLs: ${externalImages}`)
        console.log(`  📁 Local/Supabase: ${localImages}`)
        console.log(`  ❌ No image: ${noImages}`)

        console.log('\n✅ Database connection successful!')

    } catch (error) {
        console.error('❌ Database connection failed:', error.message)
    } finally {
        await pool.end()
    }
}

// Run test
testConnection() 