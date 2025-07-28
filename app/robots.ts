import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/']
      }
    ],
    sitemap: 'https://heemina.com/sitemap.xml',
    host: 'https://heemina.com'
  }
}