import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://heemina.com'

  // Static pages
  const staticPages = [
    '',
    '/menus',
    '/stores', 
    '/events',
    '/franchise',
    '/startup-session',
    '/faq'
  ].map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8
  }))

  // Dynamic pages could be added here by fetching from database
  // const dynamicPages = await fetchDynamicPages()

  return [...staticPages]
}