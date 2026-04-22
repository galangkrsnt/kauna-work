/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://work.getkauna.com",
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      { userAgent: "*", allow: "/" },
      { userAgent: "*", disallow: ["/dashboard", "/karyawan", "/settings", "/upgrade", "/sign-in", "/sign-up"] },
    ],
  },
  exclude: ["/dashboard", "/karyawan/*", "/settings", "/upgrade", "/sign-in", "/sign-up"],
  changefreq: "weekly",
  priority: 0.7,
  transform: async (config, path) => {
    const priorities = {
      "/": 1.0,
      "/gaji/slip": 1.0,
      "/gaji/pph21": 0.9,
      "/gaji/bpjs": 0.9,
      "/gaji/bersih": 0.9,
      "/panduan": 0.8,
      "/perusahaan": 0.7,
    };
    return {
      loc: path,
      changefreq: config.changefreq,
      priority: priorities[path] ?? config.priority,
      lastmod: new Date().toISOString(),
    };
  },
};
