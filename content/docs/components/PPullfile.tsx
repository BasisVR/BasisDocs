"use client";

import { useEffect } from "react";

type PList = {
  id: string;
  label: string;    // link label
  href: string;     // backup link in case data cant be loaded
  fetchUrl: string; // pulls data from this url
};

export default function PPull({ id, label, href, fetchUrl }: PList) {
  useEffect(() => {
    const status = document.getElementById(id);
    if (!status) return;

    fetch(fetchUrl)
      .then((r) => {
        if (!r.ok) throw new Error(`${r.status}`);
        return r.text();
      })
      .then((text) => {
        const pre = document.createElement("pre");
        const code = document.createElement("code");
        code.textContent = text;  // pull text into new element
        pre.appendChild(code);   
        status.replaceWith(pre);
      })
      .catch(() => {
        const anchor = status?.querySelector("a");
        if (anchor) anchor.textContent = label; // show fallback label on fail
      });
  }, [id, label, fetchUrl]);

  return (
    <p id={id}>
      <a href={href}>{label}</a> 
    </p>
  ); // throw label only on fail
}
