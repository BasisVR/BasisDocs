import defaultMdxComponents from 'fumadocs-ui/mdx';
import * as TabsComponents from 'fumadocs-ui/components/tabs';
import type { MDXComponents } from 'mdx/types';

type MdxImageType = { //to replace previously used default "any" type to circumvent no-explicit-any
  src?: string | { src: string; width?: number; height?: number };
  alt?: string;
  width?: number;
  height?: number;
  title?: string;
  className?: string;
};

function MdxImage({ src, alt, width, height, title, className }: MdxImageType) { // swapped any with newly created MDXImageType 
  const isStatic = typeof src === 'object' && src !== null;
  const url = isStatic ? src.src : src;
  // eslint-disable-next-line @next/next/no-img-element
  return (
    <img
      src={url}
      alt={alt ?? ''}
      width={width ?? (isStatic ? src.width : undefined)}
      height={height ?? (isStatic ? src.height : undefined)}
      title={title}
      className={className}
      loading="lazy"
      decoding="async"
    />
  );
}

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    ...TabsComponents,
    img: MdxImage,
    ...components,
  };
}
