# kndrstudio.github.io — Design Spec

**Date:** 2026-05-15
**Status:** Approved

## Overview

A personal creative archive site for kndrstudio, hosted on GitHub Pages. Four sections: Art, Music, Poetry, Teaching. Minimal and clean aesthetic. Bilingual (English and Russian). Designed to be updatable by a non-technical person via the GitHub web UI.

---

## Architecture & Stack

| Layer | Choice |
|---|---|
| Build tool | Vite |
| Framework | React 18 + TypeScript |
| Routing | React Router v6 with BrowserRouter |
| i18n | `i18next` + `react-i18next` |
| Styling | CSS Modules (no component library) |
| Markdown parsing | `gray-matter` + `import.meta.glob` at build time |
| Deploy | GitHub Actions → `gh-pages` branch on push to `main` |

**GitHub Pages routing:** A custom `404.html` containing a redirect script preserves the URL path and forwards to `index.html`, where React Router handles navigation. This gives clean URLs (`/art`, `/poetry/:slug`) without a server.

---

## Routes

| Route | Page |
|---|---|
| `/` | Landing — name, short bio, links to four sections |
| `/art` | Art index — grid of projects and standalone pieces |
| `/art/:project` | Art project — image gallery/slideshow |
| `/music` | Music index — list of albums and standalone tracks |
| `/music/:album` | Album page — track listing with inline audio player |
| `/poetry` | Poetry index — paginated/alphabetical list of poems |
| `/poetry/:slug` | Individual poem — full-text readable view |
| `/teaching` | Teaching — static services and courses presentation |

---

## Content Model

Content lives in `/content` at the repo root. Each piece is a Markdown file with YAML frontmatter. New content is added by creating a new file via the GitHub web UI — no git CLI required. A push to `main` triggers automatic redeployment.

### Art

Standalone piece (`/content/art/piece-slug.md`):
```yaml
---
title: "Quiet Field"
date: 2024-03-01
image: /images/art/quiet-field.jpg
description: "Oil on canvas"
description_ru: "Масло на холсте"
tags: ["painting"]
---
```

Project (`/content/art/project-slug/index.md` + per-image files):
```yaml
---
title: "Field Studies"
date: 2024-03-01
cover: /images/art/field-studies/cover.jpg
description: "A series of landscape studies"
description_ru: "Серия пейзажных зарисовок"
tags: ["painting", "series"]
---
```

Per-image file (`/content/art/project-slug/01-sketch.md`):
```yaml
---
title: "Sketch I"
image: /images/art/field-studies/01-sketch.jpg
description: "Pencil on paper"
---
```

Images committed to `/public/images/art/`.

### Music

Standalone track (`/content/music/track-slug.md`):
```yaml
---
title: "Drift"
date: 2024-05-10
audio: https://github.com/kndrstudio/kndrstudio.github.io/releases/download/v1/drift.mp3
description: "Ambient piano"
description_ru: "Эмбиент, фортепиано"
tags: ["ambient"]
---
```

Album (`/content/music/album-slug/index.md` + per-track files):
```yaml
---
title: "Slow Hours"
date: 2024-06-01
cover: /images/music/slow-hours.jpg
description: "An album about stillness"
description_ru: "Альбом о тишине"
tags: ["ambient", "piano"]
---
```

Per-track file (`/content/music/album-slug/01-opening.md`):
```yaml
---
title: "Opening"
track: 1
audio: https://github.com/kndrstudio/kndrstudio.github.io/releases/download/slow-hours/01-opening.mp3
duration: "3:42"
---
```

Audio files uploaded as GitHub Releases assets via the GitHub web UI (drag and drop, no CLI needed).

### Poetry

(`/content/poetry/poem-slug.md`) — frontmatter + Markdown body:
```yaml
---
title: "March"
date: 2024-03-15
tags: ["spring"]
---
The ice goes out.
A crow on a wire.
```

Russian translation as a sibling file (`/content/poetry/poem-slug.ru.md`):
```yaml
---
title: "Март"
date: 2024-03-15
lang: ru
---
Лёд сходит.
Ворона на проводе.
```

### Teaching

One or more Markdown files in `/content/teaching/`, each describing a service or course. Rendered as a structured static page. No subpages required.

---

## i18n

- UI strings (nav labels, buttons, metadata labels) stored in `/src/i18n/en.json` and `/src/i18n/ru.json`.
- Content metadata: `title_ru` and `description_ru` fields in frontmatter for inline translations.
- Poetry body text: separate `.ru.md` sibling files for full Russian poem versions.
- Language switcher in the top navigation (EN / RU toggle).

---

## Components

| Component | Purpose |
|---|---|
| `Nav` | Top navigation with language switcher |
| `ContentList` | Reusable paginated/sorted list (art, music, poetry index pages) |
| `Lightbox` | Fullscreen image overlay for art project pages |
| `AudioPlayer` | Inline player (play/pause, seek, elapsed/total time) per track |
| `MarkdownRenderer` | Renders poem and teaching body text |

---

## Build Tooling

**Dependencies:**
```
react, react-dom, react-router-dom
i18next, react-i18next
gray-matter
vite, @vitejs/plugin-react
typescript
```

**`import.meta.glob`** loads all `.md` files from `/content` at build time. `gray-matter` parses frontmatter. No runtime API calls — all content is bundled statically.

**GitHub Actions** (`.github/workflows/deploy.yml`):
- Trigger: push to `main`
- Steps: checkout → install → `vite build` → deploy `dist/` to `gh-pages` branch
- Live within ~1 minute of any commit

---

## Content Update Workflow (non-technical)

1. Go to the repo on GitHub.com
2. Navigate to `/content/<section>/`
3. Click **Add file → Create new file** (or click the pencil icon to edit)
4. Write frontmatter + body, commit directly to `main`
5. For audio: go to **Releases → Edit release** (or create a new one), drag and drop the `.mp3` file, copy the URL into the track's frontmatter
6. GitHub Actions rebuilds and deploys automatically
