# Passions Blog

A minimal black & white techy blog built with React, Vite, Tailwind CSS, and PocketBase.

## Features

- Clean, minimal design with dark theme
- Category-based organization for all your passions
- Mobile-first responsive layout
- Self-hosted CMS with PocketBase
- Fast and lightweight

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Set up PocketBase

Download PocketBase and run it with migrations:

```bash
# Download PocketBase (macOS ARM64)
curl -L https://github.com/pocketbase/pocketbase/releases/download/v0.25.9/pocketbase_0.25.9_darwin_arm64.zip -o pb.zip
unzip pb.zip && rm pb.zip

# Run with migrations (auto-creates collections + seed categories)
./pocketbase serve --migrationsDir=pb_migrations
```

PocketBase will be available at `http://127.0.0.1:8090`

### 3. Create admin account

Go to `http://127.0.0.1:8090/_/` and create your admin account.

The migrations automatically created:
- **categories** collection (with 9 starter categories)
- **articles** collection (with all fields ready)

### 4. Run the blog

```bash
npm run dev
```

Visit `http://localhost:5173`

## Configuration

Edit `.env` to change the PocketBase URL:

```env
VITE_POCKETBASE_URL=http://127.0.0.1:8090
```

## Project Structure

```
src/
├── components/
│   ├── Header.tsx      # Navigation header
│   ├── Footer.tsx      # Site footer
│   ├── ArticleCard.tsx # Article preview card
│   └── CategoryList.tsx # Category filter pills
├── pages/
│   ├── Home.tsx        # Homepage with articles list
│   ├── ArticlePage.tsx # Single article view
│   ├── CategoryPage.tsx # Articles by category
│   └── About.tsx       # About page
├── lib/
│   └── pocketbase.ts   # PocketBase client & helpers
├── App.tsx
├── main.tsx
└── index.css           # Tailwind + custom theme
```

## Deployment

### Frontend (Vercel/Netlify)

1. Build: `npm run build`
2. Deploy the `dist` folder
3. Set `VITE_POCKETBASE_URL` environment variable to your PocketBase URL

### PocketBase

Host PocketBase on any VPS (DigitalOcean, Hetzner, etc.) or use:
- [PocketHost](https://pockethost.io) - Free hosted PocketBase
- [Fly.io](https://fly.io) - Easy deployment
- Any server with Docker

## Writing Articles

1. Go to PocketBase admin: `http://your-pocketbase-url/_/`
2. Navigate to the Articles collection
3. Create a new article with:
   - Title and slug (URL-friendly)
   - Excerpt (short description)
   - Content (supports HTML/Markdown)
   - Cover image (optional)
   - Category
   - Tags (JSON array: `["tag1", "tag2"]`)
   - Set `published` to true when ready
   - Set publication date

## Customization

### Theme Colors

Edit the CSS variables in `src/index.css`:

```css
@theme {
  --color-bg: #0a0a0a;
  --color-text: #fafafa;
  /* etc... */
}
```

### Categories

Add category icons in `src/components/CategoryList.tsx`:

```typescript
const categoryIcons: Record<string, string> = {
  'your-category-slug': '🎯',
};
```

## License

MIT
