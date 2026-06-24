// ---------------------------------------------------------------------------
// Single source of truth for all portfolio content.
//
// The actual content lives in ./portfolio.json so it can be edited without
// touching code. This module just imports that JSON and re-exports it, so
// every section (and both the standard view and the DevView) renders from the
// exact same data.
// ---------------------------------------------------------------------------

import data from "./portfolio.json";

export const portfolio = data;

export const profile = portfolio.profile;
export const socials = portfolio.socials;
export const techStack = portfolio.techStack;
export const projects = portfolio.projects;
export const experience = portfolio.experience;
