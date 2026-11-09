import type { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/config';
import { PRODUCTS } from '@/lib/products';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  return [
    { url: `${base}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/loja`, changeFrequency: 'weekly', priority: 0.8 },
    ...['sobre', 'ajuda', 'privacidade'].map((s) => ({ url: `${base}/${s}`, changeFrequency: 'monthly' as const, priority: 0.4 })),
    ...PRODUCTS.map((p) => ({ url: `${base}/produtos/${p.slug}`, changeFrequency: 'weekly' as const, priority: 0.7 })),
  ];
}
