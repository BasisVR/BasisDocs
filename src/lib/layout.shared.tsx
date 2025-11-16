import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import Image from 'next/image';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <div className="flex items-center gap-2">
          <Image
            id="logo"
            src="/basis-docs/img/BasisLogoSmall.png"
            alt="BasisVR Logo"
            width={32}
            height={32}
            className="object-contain"
          />
          <span>BasisVR Docs</span>
        </div>
      ),
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
