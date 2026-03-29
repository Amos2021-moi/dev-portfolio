import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://markosiemo.vercel.app";

  const staticPages = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 1 },
    { url: baseUrl + "/projects", lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.9 },
    { url: baseUrl + "/blog", lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
  ];

  try {
    const [projectsRes, blogRes] = await Promise.all([
      fetch(baseUrl + "/api/projects"),
      fetch(baseUrl + "/api/blog"),
    ]);

    const projects = await projectsRes.json();
    const posts = await blogRes.json();

    const projectPages = Array.isArray(projects)
      ? projects.map((p: { slug: string; updatedAt: string }) => ({
          url: baseUrl + "/projects/" + p.slug,
          lastModified: new Date(p.updatedAt),
          changeFrequency: "monthly" as const,
          priority: 0.7,
        }))
      : [];

    const blogPages = Array.isArray(posts)
      ? posts
          .filter((p: { published: boolean }) => p.published)
          .map((p: { slug: string; updatedAt: string }) => ({
            url: baseUrl + "/blog/" + p.slug,
            lastModified: new Date(p.updatedAt),
            changeFrequency: "monthly" as const,
            priority: 0.6,
          }))
      : [];

    return [...staticPages, ...projectPages, ...blogPages];
  } catch {
    return staticPages;
  }
}