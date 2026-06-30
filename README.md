# Dev Portfolio

[![Deploy](https://github.com/HaraldMorjan/portfolio/actions/workflows/deploy.yml/badge.svg?branch=master)](https://github.com/HaraldMorjan/portfolio/actions/workflows/deploy.yml)
[![Live](https://img.shields.io/website?url=https%3A%2F%2Fhmorjan.dev&label=hmorjan.dev)](https://hmorjan.dev)

A modern, responsive developer portfolio built with [Astro](https://astro.build) and [Tailwind CSS v4](https://tailwindcss.com). The centerpiece is a categorized tech-stack showcase, with a dark/light theme toggle and a single-page anchored layout.

Push to `master` deploys automatically to [hmorjan.dev](https://hmorjan.dev) via GitHub Actions → FTPS (DonDominio) → Cloudflare.

## Editing your content

All personal content lives in one file: [`src/data/portfolio.ts`](src/data/portfolio.ts). Update the placeholders there (name, role, bio, socials, tech stack, projects, experience) and the whole site updates automatically. Look for values marked `// TODO`.

## Commands

All commands are run from the root of the project, from a terminal:

| Command           | Action                                       |
| :---------------- | :------------------------------------------- |
| `npm install`     | Installs dependencies                        |
| `npm run dev`     | Starts local dev server at `localhost:4321`  |
| `npm run build`   | Build your production site to `./dist/`      |
| `npm run preview` | Preview your build locally, before deploying |

## Project structure

```
src/
  components/   UI sections (Hero, TechStack, Projects, ...)
  data/         portfolio.ts - single source of truth for content
  layouts/      Layout.astro - HTML shell, SEO, theme script
  pages/        index.astro - composes the sections
  styles/       global.css - Tailwind import + theme tokens
```

## Tech

- Astro 7
- Tailwind CSS v4 (via `@tailwindcss/vite`)
- Class-based dark mode persisted to `localStorage`
