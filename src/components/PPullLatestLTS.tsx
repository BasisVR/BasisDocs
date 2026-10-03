"use client";

import { useEffect, useState } from "react";
import PPull from "./PPullfile";

const repository = "BasisVR/Basis";
const projectVersionPath = "Basis/ProjectSettings/ProjectVersion.txt";

type PPullLatestLTSProps = {
  id: string;
  fallbackBranch: string;
};

async function findLatestLongTermSupportBranch(
  repository: string,
  signal?: AbortSignal,
): Promise<string | null> {
  let latest: string | null = null;

  for (let page = 1; ; page++) {
    const response = await fetch(
      `https://api.github.com/repos/${repository}/branches?per_page=100&page=${page}`,
      { signal, headers: { Accept: "application/vnd.github+json" } },
    );
    if (!response.ok) throw new Error(`GitHub returned ${response.status}`);

    const branches: unknown = await response.json();
    if (!Array.isArray(branches)) throw new Error("Invalid GitHub branches response");

    for (const branch of branches) {
      if (typeof branch?.name !== "string") throw new Error("Invalid GitHub branch");

      // Fixed-width YYYYMMDD dates sort chronologically, regardless of API order.
      if (/^long-term-support-\d{8}$/.test(branch.name) && (!latest || branch.name > latest)) {
        latest = branch.name;
      }
    }

    if (branches.length < 100) return latest;
  }
}

export default function PPullLatestLTS({ id, fallbackBranch }: PPullLatestLTSProps) {
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    findLatestLongTermSupportBranch(repository, controller.signal)
      .then((branch) => {
        if (!controller.signal.aborted) setSelectedBranch(branch ?? fallbackBranch);
      })
      .catch(() => {
        // Keep the last known LTS usable when GitHub is unavailable or rate limited.
        if (!controller.signal.aborted) setSelectedBranch(fallbackBranch);
      });

    return () => controller.abort();
  }, [fallbackBranch]);

  if (!selectedBranch) {
    return (
      <p id={id}>
        <a href={`https://github.com/${repository}/tree/${encodeURIComponent(fallbackBranch)}`}>
          {fallbackBranch}
        </a>
      </p>
    );
  }

  const branch = encodeURIComponent(selectedBranch);

  return (
    <PPull
      id={id}
      label={selectedBranch}
      href={`https://github.com/${repository}/tree/${branch}`}
      fetchUrl={`https://raw.githubusercontent.com/${repository}/refs/heads/${branch}/${projectVersionPath}`}
    />
  );
}
