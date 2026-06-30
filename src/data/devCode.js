// ---------------------------------------------------------------------------
// Generates the "code editor" content for the DevView from the shared
// portfolio data, so the technical view and the standard view never diverge.
// ---------------------------------------------------------------------------

function camel(s) {
  const parts = s.split(/[^a-zA-Z0-9]+/).filter(Boolean);
  return parts
    .map((p, i) => (i === 0 ? p.toLowerCase() : p[0].toUpperCase() + p.slice(1)))
    .join("");
}

function listLines(items, indent) {
  return items.map((i) => `${indent}${JSON.stringify(i)},`).join("\n");
}

/** about.ts - the tech stack + profile expressed as TypeScript. */
export function aboutTs(p, t = {}) {
  const skillsComment =
    t.skillsComment || "Flatten every category into a single skills list";
  const stack = p.techStack
    .map((c) => `  ${camel(c.category)}: [\n${listLines(c.items, "    ")}\n  ],`)
    .join("\n");

  return `interface Developer {
  name: string;
  role: string;
  location: string;
  available: boolean;
}

const techStack = {
${stack}
} as const;

const me: Developer = {
  name: ${JSON.stringify(p.profile.name)},
  role: ${JSON.stringify(p.profile.role)},
  location: ${JSON.stringify(p.profile.location)},
  available: true,
};

// ${skillsComment}
const skills: string[] = Object.values(techStack).flat();

export { me, techStack, skills };
`;
}

/** stack.md - the tech stack rendered as Markdown (mirrors the Stack section). */
export function stackMd(p) {
  const body = p.techStack
    .map((c) => {
      const lines = [`## ${c.category}`, ""];
      if (c.description) lines.push(c.description, "");
      lines.push(c.items.map((i) => `\`${i}\``).join(" · "));
      return lines.join("\n");
    })
    .join("\n\n");

  return `# Tech stack

> The languages, frameworks, and tools I use to design, build, and ship software end to end.

${body}
`;
}

/** experience.md - the work history rendered as Markdown (mirrors the Experience section). */
export function experienceMd(p) {
  const body = p.experience
    .map((e) =>
      [`## ${e.role} @ ${e.company}`, "", `\`${e.period}\``, "", e.description].join("\n"),
    )
    .join("\n\n");

  return `# Experience

> Where I've worked

${body}
`;
}

/** projects.md - the projects rendered as Markdown. */
export function projectsMd(p) {
  const body = p.projects
    .map((pr) => {
      const lines = [
        `## ${pr.title}${pr.featured ? " ⭐" : ""}`,
        "",
        pr.description,
        "",
        `- **Stack:** ${pr.tags.join(", ")}`,
      ];
      if (pr.repoUrl) lines.push(`- **Code:** ${pr.repoUrl}`);
      if (pr.liveUrl) lines.push(`- **Live:** ${pr.liveUrl}`);
      return lines.join("\n");
    })
    .join("\n\n");

  return `# Projects\n\n${body}\n`;
}

/** README.md - profile / about landing doc for the dev view (no duplicate experience or contact). */
export function readmeMd(p, t = {}) {
  const profile = p.profile;
  const aboutHeading = t.readmeAbout || "About";
  const topSkillsHeading = t.readmeTopSkills || "Top skills";
  const seeAlsoHeading = t.readmeSeeAlso || "See also";
  const seeAlsoIntro =
    t.readmeSeeAlsoIntro ||
    "Work history, stack, projects, and contact live in their own tabs — this file is the narrative.";

  const paragraphs =
    profile.about && profile.about.length > 0 ? profile.about : [profile.bio];
  const aboutBody = paragraphs.join("\n\n");

  const badges =
    profile.badges && profile.badges.length > 0
      ? `\n\n${profile.badges.map((b) => `\`${b}\``).join(" · ")}\n`
      : "";

  const mobility = profile.mobility ? `\n\n> ${profile.mobility}\n` : "";

  const topSkills =
    profile.topSkills && profile.topSkills.length > 0
      ? `\n\n### ${topSkillsHeading}\n\n${profile.topSkills.map((s) => `- ${s}`).join("\n")}\n`
      : "";

  const pointers = [
    t.readmePointerExperience ||
      "- **Experience** → `experience.md` or run `experience`",
    t.readmePointerStack || "- **Stack** → `stack.md` or run `stack`",
    t.readmePointerProjects ||
      "- **Projects** → `projects.md` or run `projects`",
    t.readmePointerAbout || "- **Profile (code)** → `about.ts` or run `about`",
    t.readmePointerContact ||
      "- **Contact** → standard view Contact section, or run `contactme` / `socials`",
  ].join("\n");

  return `# ${profile.name}

> ${profile.tagline}

**${profile.role}** · ${profile.location}${badges}

## ${aboutHeading}

${aboutBody}${mobility}${topSkills}

## ${seeAlsoHeading}

${seeAlsoIntro}

${pointers}
`;
}
