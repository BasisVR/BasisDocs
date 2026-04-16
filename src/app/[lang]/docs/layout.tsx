import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/notebook';
import { baseOptions } from '@/lib/layout.shared';
import type { ReactNode } from 'react';

export default async function Layout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  return (
    <DocsLayout
      tree={source.pageTree[lang]}
      {...baseOptions(lang)}
      sidebar={{
        defaultOpenLevel: 0,
        footer: (
          <div className="text-xs text-muted-foreground p-4">
            Distributed under the MIT License.
          </div>
        ),
      }}
      links={[
        {
          type: 'menu',
          text: 'Community',
          items: [
            {
              text: 'Discord',
              url: 'https://discord.gg/aCzSPKEW2v',
              external: true,
            },
            {
              text: 'BSky',
              url: 'https://bsky.app/profile/basisvr.org',
              external: true,
            },
            {
              text: 'X',
              url: 'https://x.com/basisvr',
              external: true,
            },
          ],
        },
        {
          type: 'menu',
          text: 'More',
          items: [
            {
              text: 'GitHub',
              url: 'https://github.com/BasisVR/Basis',
              external: true,
            },
          ],
        },
      ]}
    >
      {children}
    </DocsLayout>
  );
}
