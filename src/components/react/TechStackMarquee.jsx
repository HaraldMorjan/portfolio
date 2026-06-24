import { useMemo } from "react";

// Fixed accent dots per category so the wall stays readable at a glance.
// (The badge surface/border still use theme tokens, so it follows the
//  Theme Studio; only the small status dot is category-coded.)
const CATEGORY_DOT = {
  Frontend: "bg-sky-400",
  Backend: "bg-emerald-400",
  DevOps: "bg-violet-400",
  AI: "bg-amber-400",
  Hosting: "bg-rose-400",
};

function Badge({ name, category }) {
  const dot = CATEGORY_DOT[category] || "bg-accent";
  return (
    <span
      className="mx-1.5 inline-flex shrink-0 items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 font-mono text-sm text-text shadow-sm transition hover:-translate-y-0.5 hover:border-accent"
      title={category}
    >
      <span className={`h-2 w-2 rounded-full ${dot}`} aria-hidden="true" />
      {name}
    </span>
  );
}

function Row({ items, direction, duration }) {
  // The track is rendered twice back-to-back; animating it by -50%
  // (or from -50% to 0) makes the loop seamless.
  const loop = [...items, ...items];
  return (
    <div className="tech-marquee-row relative flex overflow-hidden">
      <ul
        className="tech-marquee-track flex w-max items-center py-2"
        style={{
          animationName: direction === "right" ? "marquee-right" : "marquee-left",
          animationDuration: `${duration}s`,
        }}
      >
        {loop.map((item, i) => (
          <li key={`${item.name}-${i}`} aria-hidden={i >= items.length || undefined}>
            <Badge name={item.name} category={item.category} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function TechStackMarquee({ groups = [] }) {
  // Flatten every technology into a single list tagged with its category.
  const all = useMemo(
    () =>
      groups.flatMap((g) =>
        (g.items || []).map((name) => ({ name, category: g.category })),
      ),
    [groups],
  );

  // Distribute round-robin into three rows so each row is balanced.
  const rows = useMemo(() => {
    const r = [[], [], []];
    all.forEach((item, i) => r[i % 3].push(item));
    return r;
  }, [all]);

  const total = all.length;
  const categories = useMemo(
    () => groups.map((g) => g.category).filter(Boolean),
    [groups],
  );

  return (
    <section aria-label={`${total} technologies`} className="mt-10">
      <div className="tech-marquee relative flex flex-col gap-3">
        {/* Edge fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-bg to-transparent sm:w-20" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-bg to-transparent sm:w-20" />

        <Row items={rows[0]} direction="left" duration={42} />
        <Row items={rows[1]} direction="right" duration={34} />
        <Row items={rows[2]} direction="left" duration={48} />
      </div>

      {/* Category legend */}
      <ul className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2">
        {categories.map((cat) => (
          <li key={cat} className="inline-flex items-center gap-2 text-xs text-muted">
            <span
              className={`h-2 w-2 rounded-full ${CATEGORY_DOT[cat] || "bg-accent"}`}
              aria-hidden="true"
            />
            {cat}
          </li>
        ))}
      </ul>
    </section>
  );
}
