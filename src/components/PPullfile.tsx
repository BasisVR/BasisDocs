"use client";

import { useEffect, useState } from "react";
import { CodeBlock, Pre } from "fumadocs-ui/components/codeblock";

type PList = {
  id: string;
  label: string;   // Link label
  href: string;     // Link and fallback when the content cannot be loaded
  fetchUrl: string; // Text file URL
};

type PulledContent = { fetchUrl: string } & (
  | { kind: "unity"; version: string; revision: string }
  | { kind: "text"; text: string }
);

export default function PPull({ id, label, href, fetchUrl }: PList) {
  const [loadedContent, setLoadedContent] = useState<PulledContent | null>(null);
  const currentContent = loadedContent?.fetchUrl === fetchUrl ? loadedContent : null;

  useEffect(() => {
    const controller = new AbortController();

    fetch(fetchUrl, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`${response.status}`);
        return response.text();
      })
      .then((text) => {
        if (controller.signal.aborted) return;

        const match = text.match(
          /^m_EditorVersionWithRevision:[ \t]*([0-9][A-Za-z0-9.]*)[ \t]+\(([0-9a-fA-F]{12})\)[ \t]*\r?$/m,
        );
        setLoadedContent(match
          ? { fetchUrl, kind: "unity", version: match[1], revision: match[2] }
          : { fetchUrl, kind: "text", text });
      })
      .catch(() => {
        // The fallback link remains available if the request fails.
      });

    return () => controller.abort();
  }, [fetchUrl]);

  if (currentContent?.kind === "text") {
    return (
      <CodeBlock id={id}>
        <Pre>
          <code className="px-4">{currentContent.text}</code>
        </Pre>
      </CodeBlock>
    );
  }

  return (
    <p id={id}>
      {currentContent?.kind === "unity" && (
        <>
          <a href={`unityhub://${currentContent.version}/${currentContent.revision}`}>
            {currentContent.version}
          </a>{" "}
          ·{" "}
        </>
      )}
      <a href={href}>{label}</a>
    </p>
  );
}
