#!/bin/sh
# Builds bookmarklet.txt and bookmarklet.html from bookmarklet.js.
set -e
cd "$(dirname "$0")"
node -e '
const fs = require("fs");
const src = fs.readFileSync("bookmarklet.js", "utf8").split("\n").map(l => l.trim()).filter(Boolean).join(" ");
const href = "javascript:" + encodeURIComponent(src);
const esc = s => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
fs.writeFileSync("bookmarklet.txt", href + "\n");
fs.writeFileSync("bookmarklet.html", fs.readFileSync("bookmarklet.template.html", "utf8")
  .replace("BOOKMARKLET_HREF", esc(href)).replace("BOOKMARKLET_TEXT", esc(href)));
'
