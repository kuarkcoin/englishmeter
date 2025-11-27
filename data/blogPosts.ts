// data/blogPosts.ts
export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  date: string;
  readingTime: string;
  image: string;
  contentHtml: string;
};

export const blogPosts: BlogPost[] = [];