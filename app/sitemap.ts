import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://englishmeter.net'

  // 1. Sabit Sayfalar (Ana Sayfa)
  const routes = [''].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 1,
  }))

  // 2. Yarış Sayfaları (Race 1 - Race 5)
  const raceRoutes = [1, 2, 3, 4, 5].map((id) => ({
    url: `${baseUrl}/race/${id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // 3. Seviye Testleri (A1 - C2)
  const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']
  const levelRoutes = levels.map((level) => ({
    url: `${baseUrl}/levels/${level}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // 4. Özel Testler (Grammar & Vocab)
  // page.tsx dosyanızdaki slug'lara göre:
  const tests = [
    'quick-placement',
    'grammar-mega-test-100',
    'vocab-b1-c1-50',
    'test-perfect-past',
    'test-conditionals',
    'test-relatives',
    'test-articles',
    'test-tenses-mixed'
  ]
  
  const testRoutes = tests.map((slug) => ({
    url: `${baseUrl}/start?testSlug=${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [...routes, ...raceRoutes, ...levelRoutes, ...testRoutes]
}
