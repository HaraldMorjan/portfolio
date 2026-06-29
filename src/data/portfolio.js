// ---------------------------------------------------------------------------
// Single source of truth for all portfolio content.
//
// The actual content lives in ./portfolio.json, now keyed by locale:
//   { en: {...}, es: {...}, socials: [...] }
//
// `socials` is language-neutral and shared. Use getPortfolio(lang) to pull a
// fully-resolved content object for a given locale. The named exports below
// default to English so the DevView and any non-localized code keep working.
// ---------------------------------------------------------------------------

import data from "./portfolio.json";
import { DEFAULT_LANG } from "./i18n.js";

export const portfolioData = data;

export function getPortfolio(lang = DEFAULT_LANG) {
  const locale = data[lang] || data[DEFAULT_LANG];
  return {
    profile: locale.profile,
    socials: data.socials,
    techStack: locale.techStack,
    projects: locale.projects,
    experience: locale.experience,
  };
}

// Backward-compatible English exports.
const en = getPortfolio(DEFAULT_LANG);

export const portfolio = en;
export const profile = en.profile;
export const socials = en.socials;
export const techStack = en.techStack;
export const projects = en.projects;
export const experience = en.experience;
