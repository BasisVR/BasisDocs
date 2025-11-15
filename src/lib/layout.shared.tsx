import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: 'BasisVR Docs',
      transparentMode: 'top',
    },
    links: [
      {
        text: 'Pages',
        url: '/docs',
        active: 'nested-url',
      },
      {
        text: 'GitHub',
        url: 'https://github.com/BasisVR/Basis',
        external: true,
      },
    ],
    githubUrl: 'https://github.com/BasisVR/Basis',
  };
}
