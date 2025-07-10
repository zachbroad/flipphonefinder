import { MetadataRoute } from 'next'
import { db } from '@/lib/db'
import { phone } from '@/lib/db/schema'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://flipphonefinder.com'

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/compare`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
  ]

  // Guide pages
  const guidePages = [
    {
      url: `${baseUrl}/guides`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/guides/buyers-guide`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/guides/digital-detox`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/guides/network-compatibility`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/guides/switching-guide`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
  ]

  // Blog pages
  const blogPosts = [
    'digital-detox-guide-2024',
    'tips-for-switching-to-flip-phone',
    'light-phone-3-vs-agm-m8-comparison',
    'gen-z-flip-phones',
    'setting-up-first-dumbphone',
    'science-digital-minimalism',
    'best-flip-phones-business',
  ]

  const blogPages = [
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    ...blogPosts.map(slug => ({
      url: `${baseUrl}/blog/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ]

  // Dynamic phone pages
  let phonePages: MetadataRoute.Sitemap = []
  try {
    const phones = await db.select({
      id: phone.id,
      slug: phone.slug,
      released_on: phone.released_on,
    }).from(phone)

    phonePages = phones.map(p => ({
      url: `${baseUrl}/phones/${p.slug || p.id}`,
      lastModified: p.released_on || new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    }))
  } catch (error) {
    console.error('Error fetching phones for sitemap:', error)
  }

  return [
    ...staticPages,
    ...guidePages,
    ...blogPages,
    ...phonePages,
  ]
}