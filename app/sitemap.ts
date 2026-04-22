import type { MetadataRoute } from "next";

const BASE = "https://work.getkauna.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${BASE}/`,            lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE}/gaji/slip`,   lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE}/gaji/pph21`,  lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/gaji/bpjs`,   lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/gaji/bersih`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/panduan`,     lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/perusahaan`,  lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/tentang`,     lastModified: new Date(), changeFrequency: "yearly",  priority: 0.5 },
    { url: `${BASE}/kontak`,      lastModified: new Date(), changeFrequency: "yearly",  priority: 0.5 },
    { url: `${BASE}/kebijakan-privasi`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];
}
