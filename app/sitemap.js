export default function sitemap() {
  const baseUrl = "https://sagrowinfotech.com";
  const now = new Date();
  return [
    { url: `${baseUrl}/`, lastModified: now, priority: 1.0 },
    { url: `${baseUrl}/about`, lastModified: now, priority: 0.8 },
    { url: `${baseUrl}/login`, lastModified: now, priority: 0.6 },
  ];
}
