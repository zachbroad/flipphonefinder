# Image Migration Script

This script migrates phone images from external URLs to Supabase Storage by reading directly from your database.

## Prerequisites

1. **Set up Supabase Storage bucket:**
   - Go to your Supabase dashboard
   - Navigate to Storage
   - Create a new bucket called `phone-images`
   - Set the bucket to **public** access

2. **Environment variables:**
   Make sure your `.env.local` file contains:
   ```
   DATABASE_URL=your_postgres_connection_string
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_KEY=your-service-key-here
   ```

   **Important:** You need the `SUPABASE_SERVICE_KEY` (not just the anon key) to upload files. Find it in your Supabase dashboard under Settings > API.

## How it works

1. **Reads phone data** directly from your PostgreSQL database
2. **Identifies phones** that have external image URLs (starting with `http`)
3. **Downloads images** from external URLs to a temporary folder
4. **Uploads images** to Supabase Storage bucket `phone-images`
5. **Updates database** with new Supabase Storage URLs
6. **Cleans up** temporary files

## Running the migration

```bash
node scripts/migrate-images.js
```

## What to expect

The script will output:
- 📱 Total phones found in database
- 🌐 Phones with external URLs (need migration)
- 📁 Phones already migrated (local/Supabase URLs)
- ❌ Phones without images
- ✅ Successfully migrated phones (with old/new URLs)
- ❌ Failed migrations (with error messages)

## Migration logic

The script automatically detects which phones need migration:
- **Needs migration**: `image` starts with `http` (external URL)
- **Already migrated**: `image` doesn't start with `http` (local/Supabase URL)
- **No image**: `image` is null or empty

## After migration

Your phone images will be stored at URLs like:
```
https://your-project.supabase.co/storage/v1/object/public/phone-images/phones/123.jpg
```

And your database `image` column will be updated from:
```
https://images.squarespace-cdn.com/content/...
```

To:
```
https://your-project.supabase.co/storage/v1/object/public/phone-images/phones/123.jpg
```

## Re-running the script

The script is safe to run multiple times - it will:
- Skip phones that have already been migrated
- Only process phones with external URLs
- Show you exactly what needs to be done

## Troubleshooting

**"Failed to upload to Supabase"**: Check your `SUPABASE_SERVICE_KEY` and make sure the `phone-images` bucket exists and is public.

**"Failed to download image"**: The external URL might be broken or require authentication. The script will continue with other phones.

**"No phones need migration"**: All your phones either have Supabase URLs already or no images at all. 