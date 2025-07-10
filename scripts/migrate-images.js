const { createClient } = require('@supabase/supabase-js')
const { drizzle } = require('drizzle-orm/node-postgres')
const { Pool } = require('pg')
const { eq } = require('drizzle-orm')
const fs = require('fs')
const path = require('path')
const https = require('https')

// Load environment variables
require('dotenv').config()

// Initialize Supabase client
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY // Use service key for admin operations
)

// Initialize database connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
})

// Define the phone table schema for the migration
const { pgTable, text, integer, boolean, doublePrecision, jsonb, timestamp, index } = require('drizzle-orm/pg-core')

const phone = pgTable('phone', {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    slug: text('slug'),
    name: text('name'),
    description: text('description'),
    released_on: timestamp('released_on'),
    android_auto: text('android_auto'),
    asia_network: jsonb('asia_network'),
    bluetooth: jsonb('bluetooth'),
    brand: text('brand'),
    browser: jsonb('browser'),
    calendar: boolean('calendar'),
    camera: jsonb('camera'),
    category: jsonb('category'),
    dual_sim: jsonb('dual_sim'),
    email: jsonb('email'),
    esim: jsonb('esim'),
    europe_network: jsonb('europe_network'),
    featured: boolean('featured').default(false),
    gps_navigation: jsonb('gps_navigation'),
    group_text_mms: jsonb('group_text_mms'),
    headphone_jack: jsonb('headphone_jack'),
    hotspot_tethering: jsonb('hotspot_tethering'),
    image: text('image'),
    link: text('link'),
    network: jsonb('network'),
    nfc_support: text('nfc_support'),
    operating_system: jsonb('operating_system'),
    podcasts_music: jsonb('podcasts_music'),
    price: text('price'),
    rating: doublePrecision('rating'),
    region: jsonb('region'),
    removable_battery: jsonb('removable_battery'),
    rideshare: jsonb('rideshare'),
    rugged: jsonb('rugged'),
    screen_size_inches: doublePrecision('screen_size_inches'),
    screen_type: jsonb('screen_type'),
    sd_cards: jsonb('sd_cards'),
    shape: jsonb('shape'),
    signal_app: jsonb('signal_app'),
    sim_type: jsonb('sim_type'),
    sold_unlocked: jsonb('sold_unlocked'),
    spotify: jsonb('spotify'),
    support_and_updates: jsonb('support_and_updates'),
    supported_networks: jsonb('supported_networks'),
    t9_keyboard: jsonb('t9_keyboard'),
    touchscreen: text('touchscreen'),
    two_factor_auth: jsonb('two_factor_auth'),
    usb_type: jsonb('usb_type'),
    voice_to_text: jsonb('voice_to_text'),
    volte: boolean('volte'),
    whatsapp: jsonb('whatsapp'),
    wifi_calling: jsonb('wifi_calling'),
}, (table) => ({
    idIndex: index('dump_id_index').on(table.id),
}))

const db = drizzle(pool, { schema: { phone } })

async function downloadImage(url, filename) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(filename)
        https.get(url, (response) => {
            response.pipe(file)
            file.on('finish', () => {
                file.close(resolve)
            })
        }).on('error', reject)
    })
}

async function uploadToSupabase(localPath, remotePath) {
    const fileBuffer = fs.readFileSync(localPath)

    // Detect content type from file extension
    const ext = path.extname(localPath).toLowerCase()
    let contentType = 'image/png'
    if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg'
    if (ext === '.gif') contentType = 'image/gif'
    if (ext === '.webp') contentType = 'image/webp'

    const { data, error } = await supabase.storage
        .from('phone-images')
        .upload(remotePath, fileBuffer, {
            upsert: true,
            contentType: contentType
        })

    if (error) throw error

    const { data: { publicUrl } } = supabase.storage
        .from('phone-images')
        .getPublicUrl(remotePath)

    return publicUrl
}

async function migrateImages() {
    const tempDir = './temp-images'
    if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir)
    }

    let migrated = 0
    let failed = 0
    let skipped = 0
    let alreadyMigrated = 0

    try {
        // Get all phones from database that have external image URLs
        console.log('🔍 Fetching phones from database...')
        const phones = await db.select({
            id: phone.id,
            name: phone.name,
            brand: phone.brand,
            image: phone.image
        }).from(phone)

        console.log(`📱 Found ${phones.length} phones in database`)

        // Filter phones that need migration (have external URLs)
        const phonesToMigrate = phones.filter(p => p.image && p.image.startsWith('http'))
        const phonesAlreadyMigrated = phones.filter(p => p.image && !p.image.startsWith('http'))
        const phonesWithoutImages = phones.filter(p => !p.image)

        console.log(`🌐 Phones with external URLs: ${phonesToMigrate.length}`)
        console.log(`📁 Phones already migrated: ${phonesAlreadyMigrated.length}`)
        console.log(`❌ Phones without images: ${phonesWithoutImages.length}`)

        if (phonesToMigrate.length === 0) {
            console.log('✅ No phones need migration!')
            return
        }

        console.log('\n🚀 Starting migration...\n')

        for (const phoneRecord of phonesToMigrate) {
            try {
                const displayName = `${phoneRecord.brand || 'Unknown'} ${phoneRecord.name || 'Unknown'}`
                console.log(`Processing ${displayName} (ID: ${phoneRecord.id})...`)

                // Detect file extension from URL
                const imageUrl = phoneRecord.image
                const fileExtension = imageUrl.includes('.jpg') ? '.jpg' :
                    imageUrl.includes('.jpeg') ? '.jpeg' :
                        imageUrl.includes('.gif') ? '.gif' :
                            imageUrl.includes('.webp') ? '.webp' : '.png'

                // Download image to temp directory
                const tempPath = path.join(tempDir, `${phoneRecord.id}${fileExtension}`)
                await downloadImage(imageUrl, tempPath)

                // Upload to Supabase Storage
                const remotePath = `phones/${phoneRecord.id}${fileExtension}`
                const newUrl = await uploadToSupabase(tempPath, remotePath)

                // Update database with new Supabase URL
                await db.update(phone)
                    .set({ image: newUrl })
                    .where(eq(phone.id, phoneRecord.id))

                // Clean up temp file
                fs.unlinkSync(tempPath)

                migrated++
                console.log(`✅ Migrated ${displayName}`)
                console.log(`   Old: ${imageUrl.substring(0, 50)}...`)
                console.log(`   New: ${newUrl.substring(0, 50)}...\n`)

            } catch (error) {
                const displayName = `${phoneRecord.brand || 'Unknown'} ${phoneRecord.name || 'Unknown'}`
                console.error(`❌ Failed to migrate ${displayName}:`, error.message)
                failed++
            }
        }

    } catch (error) {
        console.error('💥 Migration failed:', error.message)
        throw error
    } finally {
        // Clean up temp directory
        if (fs.existsSync(tempDir)) {
            fs.rmSync(tempDir, { recursive: true, force: true })
        }

        console.log(`\n📊 Migration complete:`)
        console.log(`✅ Successfully migrated: ${migrated}`)
        console.log(`❌ Failed: ${failed}`)
        console.log(`📁 Already migrated: ${phonesAlreadyMigrated.length}`)
        console.log(`⏭️  Skipped (no image): ${phonesWithoutImages.length}`)

        // Close database connection
        await pool.end()
    }
}

// Run migration
migrateImages().catch((error) => {
    console.error('Migration failed:', error)
    process.exit(1)
}) 