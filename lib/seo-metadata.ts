import { Metadata } from "next"

interface SeoMetadata {
  title: string
  description: string
  image?: string
  url?: string
  keywords?: string[]
  author?: string
}

export function generateSeoMetadata(seo: SeoMetadata): Metadata {
  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    authors: seo.author ? [{ name: seo.author }] : undefined,
    openGraph: {
      title: seo.title,
      description: seo.description,
      images: seo.image ? [{ url: seo.image }] : undefined,
      url: seo.url,
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: seo.image ? [seo.image] : undefined,
    },
  }
}
