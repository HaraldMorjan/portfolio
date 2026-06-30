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

export const PORTFOLIO_GITHUB_REPO = "HaraldMorjan/portfolio";
export const DEFAULT_DEPLOY_BRANCH = "master";

export function githubRepoFromUrl(repoUrl) {
  const match = repoUrl?.match(/github\.com\/([^/]+\/[^/?#]+)/);
  return match?.[1] ?? null;
}

/** GitHub Actions workflow URL for projects with autoDeploy enabled. */
export function projectWorkflowUrl(project) {
  if (!project?.autoDeploy || !project.repoUrl) return null;
  if (project.workflowUrl) return project.workflowUrl;
  return `${project.repoUrl.replace(/\/$/, "")}/actions/workflows/deploy.yml`;
}

/** shields.io-style GitHub Actions status badge for deploy.yml. */
export function projectWorkflowBadgeUrl(project) {
  const repo = githubRepoFromUrl(project?.repoUrl);
  if (!project?.autoDeploy || !repo) return null;
  const workflow = project.workflowFile ?? "deploy.yml";
  const branch = project.deployBranch ?? DEFAULT_DEPLOY_BRANCH;
  return `https://github.com/${repo}/actions/workflows/${workflow}/badge.svg?branch=${branch}`;
}

export function portfolioWorkflowUrl() {
  return `https://github.com/${PORTFOLIO_GITHUB_REPO}/actions/workflows/deploy.yml`;
}

export function portfolioWorkflowBadgeUrl() {
  return `https://github.com/${PORTFOLIO_GITHUB_REPO}/actions/workflows/deploy.yml/badge.svg?branch=${DEFAULT_DEPLOY_BRANCH}`;
}

/** Live demos on hmorjan.dev use the shared Cloudflare edge setup. */
export function projectUsesCloudflareEdge(project) {
  if (!project?.liveUrl?.trim()) return false;
  if (project.cloudflareEdge === false) return false;
  return project.cloudflareEdge === true || project.autoDeploy === true;
}

export function projectLiveHost(project) {
  if (!project?.liveUrl) return "";
  try {
    return new URL(project.liveUrl).hostname;
  } catch {
    return project.liveUrl.replace(/^https?:\/\//, "").replace(/\/.*$/, "");
  }
}

// Backward-compatible English exports.
const en = getPortfolio(DEFAULT_LANG);

export const portfolio = en;
export const profile = en.profile;
export const socials = en.socials;
export const techStack = en.techStack;
export const projects = en.projects;
export const experience = en.experience;
