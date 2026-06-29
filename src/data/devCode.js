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

/** README.md - bio, experience and contact rendered as Markdown. */
export function readmeMd(p, t = {}) {
  const experienceHeading = t.readmeExperience || "Experience";
  const connectHeading = t.readmeConnect || "Connect";
  const experience = p.experience
    .map((e) => `- **${e.role}** @ ${e.company} _(${e.period})_\n  ${e.description}`)
    .join("\n");

  const socials = p.socials
    .map((s) => `- **${s.label}:** ${s.href.replace(/^mailto:/, "")}`)
    .join("\n");

  return `# ${p.profile.name}

> ${p.profile.tagline}

**${p.profile.role}** · ${p.profile.location}

${p.profile.bio}

## ${experienceHeading}

${experience}

## ${connectHeading}

${socials}
`;
}
