// ---------------------------------------------------------------------------
// Lighthouse scores surfaced as a credibility badge.
//
// These are REAL numbers from an actual audit (not hand-picked). To refresh:
//   1. npm run build && npm run preview
//   2. npx lighthouse <preview-url> --only-categories=performance,accessibility,best-practices,seo \
//        --chrome-flags="--headless" --output=json --output-path=./lh-report.json
//   3. Update the values below (scores are 0–100).
//
// Note: localhost runs use Lighthouse's simulated mobile throttling, so the
// Performance score is conservative compared to a deployed/CDN-served build.
// ---------------------------------------------------------------------------

export const lighthouse = {
  scores: {
    performance: 96,
    accessibility: 100,
    bestPractices: 100,
    seo: 100,
  },
  // Where/when/how it was measured (shown as a caption).
  formFactor: "desktop",
  measuredAt: "2026-06-27",
  version: "12.8.2",
  // The deployed URL audited (used to build the live report link).
  siteUrl: "https://haraldmorjan.dev",
  // Optional hard override for the report link. When empty, a live PageSpeed
  // Insights analysis link is generated from siteUrl + formFactor.
  reportUrl: "",
};

// Live PageSpeed Insights analysis link for the audited URL — lets visitors
// re-run the audit themselves against the deployed site.
export function reportUrl() {
  if (lighthouse.reportUrl) return lighthouse.reportUrl;
  const params = new URLSearchParams({
    url: lighthouse.siteUrl,
    form_factor: lighthouse.formFactor || "desktop",
  });
  return `https://pagespeed.web.dev/analysis?${params.toString()}`;
}

// Lighthouse's own threshold colors: ≥90 green, 50–89 orange, <50 red.
export function scoreColor(score) {
  if (score >= 90) return "#0cce6b";
  if (score >= 50) return "#ffa400";
  return "#ff4e42";
}
