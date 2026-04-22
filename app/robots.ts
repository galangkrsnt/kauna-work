import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard", "/karyawan", "/settings", "/upgrade", "/sign-in", "/sign-up"],
    },
    sitemap: "https://work.getkauna.com/sitemap.xml",
  };
}
