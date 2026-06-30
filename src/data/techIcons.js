// ---------------------------------------------------------------------------
// Shared brand-icon resolver (Simple Icons). Single source of truth used by the
// Tech Explorer, the Projects section, and anywhere else that shows tech logos.
// ---------------------------------------------------------------------------
import {
  siAstro,
  siReact,
  siSencha,
  siVuedotjs,
  siJavascript,
  siTypescript,
  siTailwindcss,
  siMarkdown,
  siMui,
  siExpress,
  siDotnet,
  siNodedotjs,
  siFirebase,
  siMongodb,
  siMysql,
  siSocketdotio,
  siGithub,
  siGithubactions,
  siGithubcopilot,
  siCloudflare,
} from "simple-icons";

// Canonical tech name → official brand logo.
export const ICONS = {
  Astro: siAstro,
  React: siReact,
  ExtJS: siSencha,
  Vue: siVuedotjs,
  JavaScript: siJavascript,
  TypeScript: siTypescript,
  "Tailwind CSS": siTailwindcss,
  Markdown: siMarkdown,
  "Material UI": siMui,
  "Express.js": siExpress,
  LINQ: siDotnet,
  ".NET": siDotnet,
  ".NET Core": siDotnet,
  "Node.js": siNodedotjs,
  Firebase: siFirebase,
  MongoDB: siMongodb,
  MySQL: siMysql,
  "Socket.IO": siSocketdotio,
  GitHub: siGithub,
  "GitHub Actions": siGithubactions,
  "GitHub Copilot": siGithubcopilot,
  Cloudflare: siCloudflare,
};

// Common alternative spellings (e.g. project tags) → canonical key.
const ALIASES = {
  node: "Node.js",
  nodejs: "Node.js",
  "node.js": "Node.js",
  tailwind: "Tailwind CSS",
  tailwindcss: "Tailwind CSS",
  "tailwind css": "Tailwind CSS",
  vue: "Vue",
  vuejs: "Vue",
  "vue.js": "Vue",
  react: "React",
  reactjs: "React",
  astro: "Astro",
  javascript: "JavaScript",
  js: "JavaScript",
  typescript: "TypeScript",
  ts: "TypeScript",
  ".net": ".NET",
  dotnet: ".NET",
  express: "Express.js",
  expressjs: "Express.js",
  "express.js": "Express.js",
  mongodb: "MongoDB",
  mysql: "MySQL",
  "socket.io": "Socket.IO",
  socketio: "Socket.IO",
  github: "GitHub",
  "github actions": "GitHub Actions",
  cloudflare: "Cloudflare",
  "github copilot": "GitHub Copilot",
  copilot: "GitHub Copilot",
  "material ui": "Material UI",
  materialui: "Material UI",
  mui: "Material UI",
  markdown: "Markdown",
  extjs: "ExtJS",
  linq: "LINQ",
};

/** Resolve a (possibly non-canonical) tech name to its Simple Icon, or null. */
export function resolveTech(name) {
  if (!name) return null;
  if (ICONS[name]) return ICONS[name];
  const key = ALIASES[name.toLowerCase().replace(/\s+/g, " ").trim()];
  return key ? ICONS[key] || null : null;
}

// Dark/near-black brand colors are invisible on dark backgrounds; callers
// should fall back to currentColor for these.
export function isDarkHex(hex) {
  const n = parseInt(hex, 16);
  const r = (n >> 16) & 255,
    g = (n >> 8) & 255,
    b = n & 255;
  return 0.299 * r + 0.587 * g + 0.114 * b < 64;
}

/** Brand hex (with #) for a tech, or null when missing/too dark. */
export function brandColorOf(name) {
  const icon = resolveTech(name);
  return icon && !isDarkHex(icon.hex) ? `#${icon.hex}` : null;
}

/** Short label for techs without a logo.
 *  Uses the first two alphanumerics of the name (not word-initials) so the
 *  visible monogram is always a substring of the full name. That keeps WCAG
 *  2.5.3 "Label in Name" happy when the name is also exposed via aria-label
 *  (e.g. "AZ" for "Azure DevOps" rather than the non-matching "AD"). */
export function monogram(name) {
  const clean = (name || "").replace(/[^A-Za-z0-9]/g, "");
  return clean.slice(0, 2).toUpperCase();
}
