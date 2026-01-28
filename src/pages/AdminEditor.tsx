import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeftIcon, PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';
import {
  getArticleById,
  createArticle,
  updateArticle,
  getCategories,
  getCoverImageUrl,
  uploadCoverImage,
  uploadContentImage,
  isLoggedIn,
} from '../lib/pocketbase';
import type { Article, Category } from '../lib/pocketbase';

export default function AdminEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState('');
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const contentImageRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: '',
    tags: '',
    published: false,
    publication_date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate('/admin/login');
      return;
    }

    const loadData = async () => {
      const cats = await getCategories();
      setCategories(cats);

      if (id) {
        const article = await getArticleById(id);
        if (article) {
          setForm({
            title: article.title,
            slug: article.slug,
            excerpt: article.excerpt,
            content: article.content,
            category: article.category || '',
            tags: article.tags ? article.tags.join(', ') : '',
            published: article.published,
            publication_date: article.publication_date.split(' ')[0],
          });
          
          // Set cover preview if exists
          const coverUrl = getCoverImageUrl(article);
          if (coverUrl) {
            setCoverPreview(coverUrl);
          }
        }
      }

      setLoading(false);
    };

    loadData();
  }, [id, navigate]);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleTitleChange = (title: string) => {
    setForm((prev) => ({
      ...prev,
      title,
      slug: prev.slug || generateSlug(title),
    }));
  };

  const handleCoverSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const handleCoverRemove = () => {
    setCoverFile(null);
    setCoverPreview(null);
    if (coverInputRef.current) {
      coverInputRef.current.value = '';
    }
  };

  const handleContentImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const url = await uploadContentImage(file);
    setUploadingImage(false);

    if (url) {
      // Insert Markdown image at cursor position
      const textarea = textareaRef.current;
      if (textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = form.content;
        const imageMarkdown = `![${file.name}](${url})`;
        const newContent = text.substring(0, start) + imageMarkdown + text.substring(end);
        setForm({ ...form, content: newContent });
        
        // Reset cursor position after the inserted image
        setTimeout(() => {
          textarea.focus();
          const newPos = start + imageMarkdown.length;
          textarea.setSelectionRange(newPos, newPos);
        }, 0);
      }
    } else {
      setError('Failed to upload image');
    }

    // Reset input
    if (contentImageRef.current) {
      contentImageRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    const data: Partial<Article> = {
      title: form.title,
      slug: form.slug,
      excerpt: form.excerpt,
      content: form.content,
      category: form.category || undefined,
      tags: form.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      published: form.published,
      publication_date: form.publication_date,
    };

    let result: Article | null;

    if (isEditing && id) {
      result = await updateArticle(id, data);
    } else {
      result = await createArticle(data);
    }

    if (result) {
      // Upload cover image if selected
      if (coverFile) {
        await uploadCoverImage(result.id, coverFile);
      }
      navigate('/admin');
    } else {
      setError('Failed to save article. Check that the slug is unique.');
    }

    setSaving(false);
  };

  if (!isLoggedIn()) return null;

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-32 bg-[--color-bg-tertiary] rounded" />
          <div className="h-12 bg-[--color-bg-tertiary] rounded" />
          <div className="h-32 bg-[--color-bg-tertiary] rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="mb-8">
        <Link
          to="/admin"
          className="inline-flex items-center gap-2 text-sm text-[--color-text-muted] hover:text-[--color-text] mb-4"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to articles
        </Link>
        <h1 className="text-2xl font-bold">
          {isEditing ? 'Edit Article' : 'New Article'}
        </h1>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
            {error}
          </div>
        )}

        {/* Cover Image */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Cover Image
          </label>
          
          {coverPreview ? (
            <div className="relative">
              <img
                src={coverPreview}
                alt="Cover preview"
                className="w-full aspect-[16/9] object-cover rounded-lg border border-[--color-border]"
              />
              <button
                type="button"
                onClick={handleCoverRemove}
                className="absolute top-2 right-2 p-1.5 bg-white/90 hover:bg-white rounded-full shadow-sm"
              >
                <XMarkIcon className="h-5 w-5 text-gray-700" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => coverInputRef.current?.click()}
              className="w-full aspect-[16/9] border-2 border-dashed border-[--color-border] rounded-lg flex flex-col items-center justify-center gap-2 hover:border-[--color-text-muted] transition-colors"
            >
              <PhotoIcon className="h-10 w-10 text-[--color-text-muted]" />
              <span className="text-sm text-[--color-text-muted]">
                Click to upload cover image
              </span>
              <span className="text-xs text-[--color-text-muted]">
                Recommended: 1600x900px (16:9)
              </span>
            </button>
          )}
          
          <input
            ref={coverInputRef}
            type="file"
            accept="image/*"
            onChange={handleCoverSelect}
            className="hidden"
          />
        </div>

        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-2">
            Title *
          </label>
          <input
            type="text"
            id="title"
            value={form.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="w-full px-3 py-2 border border-[--color-border] rounded-lg bg-[--color-bg] focus:border-[--color-text] focus:outline-none"
            required
          />
        </div>

        {/* Slug */}
        <div>
          <label htmlFor="slug" className="block text-sm font-medium mb-2">
            Slug *
          </label>
          <input
            type="text"
            id="slug"
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            className="w-full px-3 py-2 border border-[--color-border] rounded-lg bg-[--color-bg] focus:border-[--color-text] focus:outline-none font-mono text-sm"
            required
          />
          <p className="text-xs text-[--color-text-muted] mt-1">
            URL-friendly identifier (lowercase, numbers, hyphens only)
          </p>
        </div>

        {/* Excerpt */}
        <div>
          <label htmlFor="excerpt" className="block text-sm font-medium mb-2">
            Excerpt *
          </label>
          <textarea
            id="excerpt"
            value={form.excerpt}
            onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
            rows={2}
            className="w-full px-3 py-2 border border-[--color-border] rounded-lg bg-[--color-bg] focus:border-[--color-text] focus:outline-none resize-none"
            required
          />
        </div>

        {/* Content - Markdown */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="content" className="block text-sm font-medium">
              Content * <span className="text-[--color-text-muted] font-normal">(Markdown)</span>
            </label>
            
            {/* Image upload button */}
            <button
              type="button"
              onClick={() => contentImageRef.current?.click()}
              disabled={uploadingImage}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-[--color-text-secondary] hover:text-[--color-text] border border-[--color-border] rounded-lg hover:border-[--color-text-secondary] transition-colors disabled:opacity-50"
            >
              <PhotoIcon className="h-4 w-4" />
              {uploadingImage ? 'Uploading...' : 'Add Image'}
            </button>
            <input
              ref={contentImageRef}
              type="file"
              accept="image/*"
              onChange={handleContentImageUpload}
              className="hidden"
            />
          </div>
          
          <textarea
            ref={textareaRef}
            id="content"
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            rows={25}
            className="w-full px-4 py-3 border border-[--color-border] rounded-lg bg-[--color-bg] focus:border-[--color-text] focus:outline-none font-mono text-sm leading-relaxed"
            placeholder="Write your content in Markdown...

# Heading 1
## Heading 2

Regular paragraph with **bold** and *italic* text.

- Bullet point
- Another point

> This is a quote

```javascript
const code = 'syntax highlighted';
```

[Link text](https://example.com)

![Image alt text](image-url.jpg)"
            required
          />
        </div>

        {/* Category & Date row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="category" className="block text-sm font-medium mb-2">
              Category
            </label>
            <select
              id="category"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full px-3 py-2 border border-[--color-border] rounded-lg bg-[--color-bg] focus:border-[--color-text] focus:outline-none"
            >
              <option value="">No category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="date" className="block text-sm font-medium mb-2">
              Publication Date *
            </label>
            <input
              type="date"
              id="date"
              value={form.publication_date}
              onChange={(e) => setForm({ ...form, publication_date: e.target.value })}
              className="w-full px-3 py-2 border border-[--color-border] rounded-lg bg-[--color-bg] focus:border-[--color-text] focus:outline-none"
              required
            />
          </div>
        </div>

        {/* Tags */}
        <div>
          <label htmlFor="tags" className="block text-sm font-medium mb-2">
            Tags
          </label>
          <input
            type="text"
            id="tags"
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
            className="w-full px-3 py-2 border border-[--color-border] rounded-lg bg-[--color-bg] focus:border-[--color-text] focus:outline-none"
            placeholder="tag1, tag2, tag3"
          />
          <p className="text-xs text-[--color-text-muted] mt-1">
            Comma-separated list of tags
          </p>
        </div>

        {/* Published */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="published"
            checked={form.published}
            onChange={(e) => setForm({ ...form, published: e.target.checked })}
            className="w-4 h-4 rounded border-[--color-border] text-[--color-accent] focus:ring-[--color-accent]"
          />
          <label htmlFor="published" className="text-sm font-medium">
            Published
          </label>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 pt-4 border-t border-[--color-border]">
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? 'Saving...' : isEditing ? 'Update Article' : 'Create Article'}
          </button>
          <Link to="/admin" className="btn-secondary">
            Cancel
          </Link>
        </div>
      </form>

      {/* Markdown Help */}
      <div className="mt-12 p-4 bg-[--color-bg-secondary] rounded-lg border border-[--color-border]">
        <h3 className="font-medium mb-4">Markdown Cheatsheet</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <p className="font-medium text-[--color-text]">Text Formatting</p>
            <div className="text-[--color-text-secondary] font-mono space-y-1">
              <p># Heading 1</p>
              <p>## Heading 2</p>
              <p>### Heading 3</p>
              <p>**bold text**</p>
              <p>*italic text*</p>
              <p>`inline code`</p>
            </div>
          </div>
          <div className="space-y-2">
            <p className="font-medium text-[--color-text]">Links & Images</p>
            <div className="text-[--color-text-secondary] font-mono space-y-1">
              <p>[Link text](url)</p>
              <p>![Alt text](image-url)</p>
            </div>
          </div>
          <div className="space-y-2">
            <p className="font-medium text-[--color-text]">Lists</p>
            <div className="text-[--color-text-secondary] font-mono space-y-1">
              <p>- Bullet item</p>
              <p>1. Numbered item</p>
              <p>- [ ] Task item</p>
            </div>
          </div>
          <div className="space-y-2">
            <p className="font-medium text-[--color-text]">Blocks</p>
            <div className="text-[--color-text-secondary] font-mono space-y-1">
              <p>&gt; Quote text</p>
              <p>``` code block ```</p>
              <p>---  (horizontal line)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
