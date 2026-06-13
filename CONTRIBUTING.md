# Contributing to BasisDocs

BasisDocs is the documentation site at **https://docs.basisvr.org**. It is a
[Next.js](https://nextjs.org) app built with [Fumadocs](https://fumadocs.dev):
pages are written in **MDX** (Markdown plus React components) and the navigation
is driven by small `meta.json` files. This guide explains how to add and edit
documentation in the format the site expects.

## Local development

```bash
npm install        # install dependencies (first time only)
npm run dev        # start the dev server at http://localhost:3000
npm run build      # production build — run this before opening a PR
```

`npm run dev` hot-reloads as you edit. Always run `npm run build` before
submitting: a broken MDX file (a bad import, a stray `<` or `{`, unknown
frontmatter) fails the build, and the same build runs in CI on every push to
`main`.

## Repository layout

| Path | What lives there |
| --- | --- |
| `content/docs/` | All documentation pages (`.mdx`) and navigation (`meta.json`) |
| `public/img/` | Images, grouped into a folder per documentation section |
| `src/` | Site code — layout, i18n config, search. Rarely touched for content work |
| `source.config.ts` | Fumadocs config: frontmatter schema, code themes, languages |
| `.github/workflows/deploy.yml` | Builds and deploys the site to GitHub Pages |

Documentation is organised into sections, each its own folder under
`content/docs/` — for example `content/docs/world/`, `content/docs/avatar/`,
`content/docs/server/`. A section folder contains:

- `index.mdx` — the section landing page.
- One `.mdx` file per page (the file name is the page's URL slug).
- `meta.json` — the section's title, icon, and page order.

## Anatomy of a page

Every page is an `.mdx` file that starts with a YAML **frontmatter** block:

```mdx
---
title: Media Player
description: One sentence describing the page, used for search and link cards.
---

import { Callout } from 'fumadocs-ui/components/callout';

## First heading

Page content here…
```

- **`title`** (required) — the page title shown in the sidebar and at the top.
- **`description`** (optional but recommended) — a one-line summary used by
  search and by `<Card>` link previews.

After the frontmatter, `import` any components you use, then write the body.
Don't add a top-level `# H1`; the `title` provides it. Start the body at `##`.

## Navigation: `meta.json`

Each section folder has a `meta.json` that controls its sidebar entry and the
order of its pages:

```json
{
  "title": "World",
  "icon": "Globe",
  "pages": ["index", "setup", "building", "testing", "scene-props", "media-player"]
}
```

- **`title`** — the section name in the sidebar.
- **`icon`** — a [Lucide](https://lucide.dev/icons) icon name (optional).
- **`pages`** — page slugs in display order. **A new page must be added here**
  or it won't appear in the sidebar.

The top-level `content/docs/meta.json` arranges the sections themselves and
supports two extra forms: `"---Label---"` inserts a sidebar group heading, and
`"...folder"` auto-includes every page in a folder.

## Images

**Illustrate procedures with screenshots.** Steps that involve the Unity
Inspector, a component, a prefab, or an in-world result are much clearer with a
picture. Add a supporting image at the point in the instructions where the
reader needs it — show the component with the relevant fields filled in, the
prefab in the scene, or the finished result. Match the surrounding pages, which
lean on screenshots heavily (see `content/docs/world/scene-props.mdx`).

Each page keeps its images in its own folder named after the page —
`public/img/<page-slug>/`, where `<page-slug>` is the page's file name without
the `.mdx` extension (so `media-player.mdx` uses `public/img/media-player/`).
Reference them with a root-relative path (the leading `/img` maps to
`public/img`):

```mdx
![The Basis Media Player Streaming component](/img/media-player/streaming-inspector.png)
```

Keep all of a page's images in that one folder, and use lowercase, hyphenated
file names. Prefer reasonably sized PNGs or WebP; very large screenshots slow
the page down.

Some older sections store their images in a shared per-section folder (for
example `public/img/avatars/`); that's an earlier grouping. New pages use the
per-page folder above.

### Image placeholders

A markdown image reference to a file that doesn't exist yet **fails the build**
(local images are resolved and measured at build time). So if you're writing a
page before the screenshots are ready, don't leave a live `![](…)` pointing at a
missing file. Instead leave a **placeholder comment** that records exactly what
the image should show and where it goes — the build stays green, and whoever
adds the screenshot has clear instructions:

```mdx
{/* IMAGE PLACEHOLDER
    File:  public/img/media-player/streaming-inspector.png
    Show:  the Basis Media Player Streaming component with the Stream Url field filled in.
    When ready, replace this comment with:
    ![The Basis Media Player Streaming component with a stream URL set](/img/media-player/streaming-inspector.png)
*/}
```

`{/* … */}` is an MDX comment — it doesn't render on the page and won't break
the build. To add the screenshot later, drop the file at the named path and
replace the whole comment with the `![…](…)` line it contains. New pages should
include these placeholders wherever a supporting image is intended, so the image
requirements travel with the page.

## Localisation

The site ships in **eleven languages**. English is the default and is the only
version you need to write — translations are added separately.

- **Default language: `en`.** English files have **no locale suffix**:
  `setup.mdx`, `meta.json`.
- **Translations** add the locale code before the extension:
  `setup.de.mdx`, `meta.de.json`.
- Supported locales: `en` (default), plus `fr`, `de`, `es`, `ja`, `ru`, `cn`
  (Simplified Chinese), `tw` (Traditional Chinese), `nl`, `it`, `ko`.

When you add or change a page, **edit the English (`.mdx`) version**. If a
translation for a page is missing, the site falls back to English, so a new
English-only page works immediately; the localised versions can follow later.

Translated `meta.<locale>.json` files localise the section **`title`** but keep
the same `icon` and `pages` array as the English `meta.json`. If you reorder or
add pages, mirror the `pages` change into the locale meta files too (the page
slugs themselves are never translated).

### Internal links

Link between pages with a **locale-prefixed** absolute path under `/docs`:

```mdx
See [UI Canvas](/en/docs/world/ui-canvas) for the canvas setup.
```

Use the `/en/...` prefix in English pages; Fumadocs resolves the equivalent
path per locale.

## Components and code blocks

Fumadocs UI components are available by importing them at the top of the page.
The most common:

```mdx
import { Callout } from 'fumadocs-ui/components/callout';
import { Card, Cards } from 'fumadocs-ui/components/card';

<Callout type="info">Helpful aside.</Callout>
<Callout type="warn">Something to watch out for.</Callout>

<Cards>
  <Card title="Next page" description="What it covers" href="/en/docs/world/setup" />
</Cards>
```

Fenced code blocks are syntax-highlighted. The configured languages are
`csharp`, `typescript`, `javascript`, `json`, and `bash` — tag fences
accordingly:

````mdx
```csharp
var player = gameObject.AddComponent<BasisMediaPlayer>();
```
````

## MDX gotchas

MDX parses the body as JSX, so a few characters are special **outside** of code
blocks:

- A raw `<` starts a tag. Don't write `value < 10` in prose — rephrase, or wrap
  it in backticks (`` `value < 10` ``). Inside fenced code blocks it's fine.
- Raw `{` and `}` start a JavaScript expression. Avoid stray braces in prose;
  use backticks for anything containing them.
- Only import components that exist; a wrong import path fails the build.

When in doubt, run `npm run build` — it will point at the offending line.

## Adding a new page — checklist

1. Create `content/docs/<section>/<slug>.mdx` with `title` and `description`
   frontmatter.
2. Add `"<slug>"` to that section's `content/docs/<section>/meta.json` `pages`
   array, in the position you want it.
3. Add supporting screenshots under `public/img/<page-slug>/` and reference them
   as `/img/<page-slug>/<file>` at the steps that need them. If a screenshot
   isn't ready yet, leave an **image placeholder comment** (see [Image placeholders](#image-placeholders))
   instead of a live reference to a missing file.
4. Cross-link related pages with `/en/docs/...` links.
5. Run `npm run build` and confirm it passes.
6. Open a pull request. Pushes to `main` deploy automatically.

## Style

- Write for someone doing the task, not reading a spec — lead with what to do.
- Keep sentences short and concrete; prefer step lists for procedures.
- Use `<Callout type="info">` for helpful asides and `type="warn">` for
  pitfalls, rather than burying them in prose.
- Match the voice of the surrounding pages in the section you're editing.

## Submitting

Open a pull request against `main`. The deploy workflow builds the site and
publishes to GitHub Pages on merge; there's nothing to deploy by hand.
