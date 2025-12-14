// app/robots.ts
import type { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/private/', '/admin/'], // Varsa gizli klasörler
    },
    sitemap: 'https://englishmeter.net/sitemap.xml',
  }
}
