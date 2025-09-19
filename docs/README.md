# Remotive Documentation Site

This directory contains the documentation website for Remotive.

## Development

```bash
cd docs
npm install
npm run dev
```

## Structure

- `src/` - Documentation source files
- `static/` - Static assets
- `src/routes/` - Documentation pages
- `src/lib/` - Shared components

## Adding Documentation

1. Create new `.md` or `.svelte` files in `src/routes/`
2. Update navigation in `src/lib/Navigation.svelte`
3. Test locally with `npm run dev`

## Deployment

The documentation site is automatically deployed to GitHub Pages when changes are pushed to main.