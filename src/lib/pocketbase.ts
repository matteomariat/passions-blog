import PocketBase from 'pocketbase';

// Change this to your PocketBase URL
const pb = new PocketBase(import.meta.env.VITE_POCKETBASE_URL || 'http://127.0.0.1:8090');

// Disable auto-cancellation to prevent issues with React StrictMode
pb.autoCancellation(false);

export default pb;

// Types for your blog
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  created: string;
  updated: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image?: string;
  category: string;
  tags: string[];
  published: boolean;
  publication_date: string;
  created: string;
  updated: string;
  expand?: {
    category?: Category;
  };
}

// Helper functions
export async function getArticles(limit?: number, categorySlug?: string, includeUnpublished = false): Promise<Article[]> {
  try {
    let filter = includeUnpublished ? '' : 'published = true';
    
    if (categorySlug) {
      const categoryFilter = `category.slug = "${categorySlug}"`;
      filter = filter ? `${filter} && ${categoryFilter}` : categoryFilter;
    }
    
    const records = await pb.collection('articles').getList<Article>(1, limit || 50, {
      filter: filter || undefined,
      sort: '-publication_date',
      expand: 'category',
    });
    
    return records.items;
  } catch (error) {
    console.error('Error fetching articles:', error);
    return [];
  }
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  try {
    const record = await pb.collection('articles').getFirstListItem<Article>(
      `slug = "${slug}"`,
      { expand: 'category' }
    );
    return record;
  } catch (error) {
    console.error('Error fetching article:', error);
    return null;
  }
}

export async function getCategories(): Promise<Category[]> {
  try {
    const records = await pb.collection('categories').getFullList<Category>({
      sort: 'name',
    });
    return records;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const record = await pb.collection('categories').getFirstListItem<Category>(
      `slug = "${slug}"`
    );
    return record;
  } catch (error) {
    console.error('Error fetching category:', error);
    return null;
  }
}

// Get cover image URL
export function getCoverImageUrl(article: Article): string | null {
  if (!article.cover_image) return null;
  return pb.files.getUrl(article, article.cover_image);
}

// Auth functions
export function isLoggedIn(): boolean {
  return pb.authStore.isValid;
}

export async function login(email: string, password: string): Promise<boolean> {
  try {
    await pb.collection('_superusers').authWithPassword(email, password);
    return true;
  } catch (error) {
    console.error('Login error:', error);
    return false;
  }
}

export function logout(): void {
  pb.authStore.clear();
}

// Admin article functions - fetches ALL articles (published and drafts)
export async function getAllArticles(): Promise<Article[]> {
  try {
    console.log('Fetching all articles...');
    console.log('Auth valid:', pb.authStore.isValid);
    console.log('Auth token:', pb.authStore.token ? 'exists' : 'none');
    
    // Simple query - no sorting, no expand
    const records = await pb.collection('articles').getList<Article>(1, 50);
    console.log('Fetched articles:', records.items.length);
    return records.items;
  } catch (error: unknown) {
    const pbError = error as { 
      status?: number;
      message?: string;
      data?: Record<string, unknown>;
      originalError?: unknown;
    };
    console.error('Error status:', pbError.status);
    console.error('Error message:', pbError.message);
    console.error('Error data:', JSON.stringify(pbError.data, null, 2));
    console.error('Full error:', error);
    return [];
  }
}

export async function createArticle(data: Partial<Article>): Promise<Article | null> {
  try {
    const record = await pb.collection('articles').create<Article>(data);
    return record;
  } catch (error) {
    console.error('Error creating article:', error);
    return null;
  }
}

export async function updateArticle(id: string, data: Partial<Article>): Promise<Article | null> {
  try {
    const record = await pb.collection('articles').update<Article>(id, data);
    return record;
  } catch (error) {
    console.error('Error updating article:', error);
    return null;
  }
}

export async function deleteArticle(id: string): Promise<boolean> {
  try {
    await pb.collection('articles').delete(id);
    return true;
  } catch (error) {
    console.error('Error deleting article:', error);
    return false;
  }
}

export async function getArticleById(id: string): Promise<Article | null> {
  try {
    const record = await pb.collection('articles').getOne<Article>(id, {
      expand: 'category',
    });
    return record;
  } catch (error) {
    console.error('Error fetching article:', error);
    return null;
  }
}

export async function uploadCoverImage(articleId: string, file: File): Promise<Article | null> {
  try {
    const formData = new FormData();
    formData.append('cover_image', file);
    const record = await pb.collection('articles').update<Article>(articleId, formData);
    return record;
  } catch (error) {
    console.error('Error uploading cover image:', error);
    return null;
  }
}

// Upload image to a dedicated images collection or use a temporary article
export async function uploadContentImage(file: File): Promise<string | null> {
  try {
    // Create a record in the images collection
    const formData = new FormData();
    formData.append('file', file);
    
    const record = await pb.collection('images').create(formData);
    return pb.files.getUrl(record, record.file);
  } catch (error) {
    console.error('Error uploading content image:', error);
    return null;
  }
}
