"use client";

import { useEffect } from "react";


type PList = {
  id: string;
  label: string;
  href: string;
  fetchUrl: string;
};

export default function PPull({ id, label, href, fetchUrl }: PList) {
  useEffect(() => {
    const status = document.getElementById(id);
    if (!status) return;

    fetch(fetchUrl)
      .then((r) => {
        if (!r.ok) throw new Error(r.status);
        return r.text();
      })
      .then((text) => {
        const pre = document.createElement("pre");
        const code = document.createElement("code");
        code.textContent = text;
        pre.appendChild(code);
        status.replaceWith(pre);
      })
      .catch(() => {
        status.querySelector("a").textContent = label;
      });
  }, [id, label, fetchUrl]);

  return (
    <p id={id}>
      <a href={href}>{label}</a>
    </p>
  );
}
