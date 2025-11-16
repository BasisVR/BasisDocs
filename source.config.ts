import {
  defineConfig,
  defineDocs,
  frontmatterSchema,
  metaSchema,
} from 'fumadocs-mdx/config';
import { rehypeCodeDefaultOptions } from 'fumadocs-core/mdx-plugins';

/**
 * BasisVR Documentation Configuration
 * Adapted from Docusaurus config
 * 
 * Site: https://docs.basisvr.org
 * Organization: BasisVR
 * Project: BasisDocs
 */

// You can customise Zod schemas for frontmatter and `meta.json` here
// see https://fumadocs.dev/docs/mdx/collections
export const docs = defineDocs({
  dir: 'content/docs',
  docs: {
    schema: frontmatterSchema,
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
  meta: {
    schema: metaSchema,
  },
});

export default defineConfig({
  mdxOptions: {
    rehypeCodeOptions: {
      ...rehypeCodeDefaultOptions,
      themes: {
        light: 'github-light',
        dark: 'dracula',
      },
      langs: ['csharp', 'typescript', 'javascript', 'json', 'bash'],
    },
  },
});
