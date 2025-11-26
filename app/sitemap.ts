import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://englishmeter.net";
  const now = new Date().toISOString();

  return [
    // --- Main Pages ---
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/race`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.6,
    },

    // --- Level Pages ---
    ...["A1", "A2", "B1", "B2", "C1", "C2"].map((level) => ({
      url: `${baseUrl}/levels/${level}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    })),

    // --- Grammar Focus Tests (SEO için çok değerli!) ---
    ...[
      "perfect-past",
      "conditionals",
      "relatives",
      "articles",
      "tenses-mixed",
      "passive-voice",
      "reported-speech",
      "gerunds-infinitives",
      "clauses-advanced",
      "modals-advanced",
      "prepositions-advanced",
    ].map((slug) => ({
      url: `${baseUrl}/quiz/${slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    })),

    // --- Test Start Pages (optional, SEO + UX) ---
    ...["quick-placement", "grammar-mega-test-100", "vocab-b1-c1-50"].map(
      (slug) => ({
        url: `${baseUrl}/start?testSlug=${slug}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.4,
      })
    ),
  ];
}