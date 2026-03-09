import type { Metadata } from "next";
import dynamic from "next/dynamic";

const baseUrl =
  (process.env.NEXT_PUBLIC_SITE_URL || "https://englishmeter.net").replace(/\/$/, "");

const HomeClient = dynamic(() => import("./HomeClient"), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-[rgb(var(--bg))]" />,
});

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: "EnglishMeter — Free English Tests, YDS Vocabulary & Placement",
  description:
    "Take free online English tests: grammar, vocabulary, CEFR levels (A1–C2), YDS packs, flashcards and mistake review.",
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    url: baseUrl,
    siteName: "EnglishMeter",
    title: "EnglishMeter — Free English Tests & YDS Practice",
    description:
      "Find your English level in minutes. Practice YDS-style exams, vocabulary, grammar and flashcards.",
  },
  twitter: {
    card: "summary_large_image",
    title: "EnglishMeter — Free English Tests & YDS Practice",
    description:
      "Free placement tests, CEFR quizzes, YDS vocabulary and exam packs with instant review.",
  },
};

export default function Page() {
  const websiteLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "EnglishMeter",
    url: baseUrl,
  };

  const orgLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "EnglishMeter",
    url: baseUrl,
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Is EnglishMeter free?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. You can take placement tests, grammar quizzes and many practice modes for free.",
        },
      },
      {
        "@type": "Question",
        name: "How long is the placement test?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The placement test typically takes about 20–25 minutes depending on your pace.",
        },
      },
      {
        "@type": "Question",
        name: "Do you have YDS practice?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. EnglishMeter includes YDS-style exam packs, reading, grammar, synonyms and vocabulary practice.",
        },
      },
      {
        "@type": "Question",
        name: "What is the Mistake Bank?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Mistake Bank helps you revisit incorrect answers and practice weak areas efficiently.",
        },
      },
      {
        "@type": "Question",
        name: "Can I study with flashcards?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Flashcards are available to help you memorize academic vocabulary with smart review.",
        },
      },
      {
        "@type": "Question",
        name: "Does EnglishMeter show CEFR levels?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Tests are aligned to CEFR levels from A1 to C2 for clear progress tracking.",
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      <HomeClient />
    </>
  );
}
