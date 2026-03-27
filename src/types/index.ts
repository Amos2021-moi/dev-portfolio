export type Role = "ADMIN" | "EDITOR";

export type ProjectStatus = "ACTIVE" | "COMPLETED" | "ARCHIVED";

export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  content?: string;
  coverImage?: string;
  images: string[];
  techStack: string[];
  githubUrl?: string;
  liveUrl?: string;
  status: ProjectStatus;
  featured: boolean;
  views: number;
  likes: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  coverImage?: string;
  tags: string[];
  published: boolean;
  featured: boolean;
  views: number;
  readingTime?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role?: string;
  company?: string;
  content: string;
  image?: string;
  rating: number;
}

export interface Subscriber {
  id: string;
  email: string;
  name?: string;
  subscribed: boolean;
  createdAt: Date;
}

export interface Analytics {
  id: string;
  page: string;
  event: string;
  data?: Record<string, unknown>;
  ip?: string;
  country?: string;
  city?: string;
  device?: string;
  browser?: string;
  createdAt: Date;
}

export interface NavItem {
  label: string;
  href: string;
  external?: boolean;
}

export interface SiteConfig {
  name: string;
  description: string;
  url: string;
  author: {
    name: string;
    email: string;
    github: string;
    bio: string;
    title: string;
  };
}