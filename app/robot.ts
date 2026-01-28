import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/private/', 
        '/admin/', 
        '/api/',
        // '/*?*'  <-- BU SATIRI SİLDİK VEYA YORUMA ALDIK
      ],
    },
    sitemap: 'https://englishmeter.net/sitemap.xml',
  }
}
