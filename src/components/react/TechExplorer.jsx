import { useMemo, useState } from "react";
import {
  resolveTech,
  brandColorOf as brandColor,
  monogram,
} from "../../data/techIcons.js";

const CATEGORY = {
  Frontend: { dot: "bg-sky-400", text: "text-sky-400", hex: "#38bdf8" },
  Backend: { dot: "bg-emerald-400", text: "text-emerald-400", hex: "#34d399" },
  DevOps: { dot: "bg-violet-400", text: "text-violet-400", hex: "#a78bfa" },
  AI: { dot: "bg-amber-400", text: "text-amber-400", hex: "#fbbf24" },
  Hosting: { dot: "bg-rose-400", text: "text-rose-400", hex: "#fb7185" },
};
const FALLBACK = { dot: "bg-accent", text: "text-accent", hex: "var(--accent)" };
const styleFor = (cat) => CATEGORY[cat] || FALLBACK;

const REACT_CYAN = "#61DAFB";

// Ring diameters (% of the square stage), inner → outer.
const RADII = [26, 42, 58, 74, 88];

// The iconic React atom — nucleus + three electron orbits, spinning in place.
function ReactAtom({ className = "" }) {
  return (
    <svg viewBox="-12 -12 24 24" className={className} aria-hidden="true">
      <circle r="2" fill={REACT_CYAN} />
      <g
        className="orbit-anim"
        fill="none"
        stroke={REACT_CYAN}
        strokeWidth="1"
        style={{
          transformBox: "fill-box",
          transformOrigin: "center",
          animation: "tech-orbit 12s linear infinite",
        }}
      >
        <ellipse rx="11" ry="4.2" />
        <ellipse rx="11" ry="4.2" transform="rotate(60)" />
        <ellipse rx="11" ry="4.2" transform="rotate(120)" />
      </g>
    </svg>
  );
}

// A single tech "planet": a logo badge that stays upright while its ring spins.
function Planet({ item, theta, duration, reverse, dimmed, onHover }) {
  const brand = brandColor(item.name);
  const icon = resolveTech(item.name);
  return (
    <div
      className="pointer-events-none absolute inset-0"
      style={{ transform: `rotate(${theta}deg)` }}
    >
      {/* position on the ring (top center) */}
      <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
          {/* counter-spin keeps the badge upright as the ring rotates */}
        <div
          className="orbit-anim"
          style={{
            animation: `tech-orbit ${duration}s linear infinite ${reverse ? "normal" : "reverse"}`,
          }}
        >
          {/* cancel the static spoke angle so the logo starts upright */}
          <div style={{ transform: `rotate(${-theta}deg)` }}>
            <button
              type="button"
              onMouseEnter={() => onHover(item)}
              onMouseLeave={() => onHover(null)}
              onFocus={() => onHover(item)}
              onBlur={() => onHover(null)}
              title={item.name}
              aria-label={`${item.name} — ${item.category}`}
              className={`group/node pointer-events-auto relative flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-surface shadow-sm outline-none ring-1 ring-black/5 transition-[transform,opacity] duration-300 hover:z-30 hover:scale-125 focus-visible:z-30 focus-visible:scale-125 sm:h-11 sm:w-11 dark:ring-white/10 ${
                dimmed ? "opacity-25" : "opacity-100"
              } hover:[box-shadow:0_0_0_2px_var(--b),0_10px_26px_-8px_var(--b)]`}
              style={{ ["--b"]: brand || "var(--accent)" }}
            >
              {icon ? (
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5 sm:h-6 sm:w-6"
                  style={{ fill: brand || "currentColor" }}
                  aria-hidden="true"
                >
                  <path d={icon.path} />
                </svg>
              ) : (
                <span
                  className="text-[0.7rem] font-bold"
                  style={{ color: brand || "currentColor" }}
                  aria-hidden="true"
                >
                  {monogram(item.name)}
                </span>
              )}

              {/* Tooltip with the tech name. aria-hidden so the button's
                  accessible name comes solely from aria-label (avoids the
                  monogram/label mismatch axe flags). */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute bottom-full left-1/2 z-40 mb-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-text px-2 py-1 text-xs font-medium text-bg opacity-0 shadow-md transition-opacity duration-150 group-hover/node:opacity-100 group-focus-visible/node:opacity-100"
              >
                {item.name}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Orbit({ rings, hovered, setHovered, activeCat }) {
  return (
    <div className="orbit-system relative mx-auto mt-6 aspect-square w-full max-w-[34rem]">
      {/* static orbit guides */}
      {rings.map((ring, i) => (
        <div
          key={`g-${ring.category}`}
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-border/70"
          style={{ width: `${RADII[i]}%`, height: `${RADII[i]}%` }}
        />
      ))}

      {/* rotating rings with planets */}
      {rings.map((ring, i) => {
        const duration = 30 + i * 7;
        const reverse = i % 2 === 1;
        const dimCat = activeCat && activeCat !== ring.category;
        return (
          <div
            key={ring.category}
            className="orbit-anim pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{
              width: `${RADII[i]}%`,
              height: `${RADII[i]}%`,
              animation: `tech-orbit ${duration}s linear infinite ${reverse ? "reverse" : "normal"}`,
            }}
          >
            {ring.items.map((item, j) => (
              <Planet
                key={item.name}
                item={item}
                theta={(360 / ring.items.length) * j}
                duration={duration}
                reverse={reverse}
                dimmed={
                  dimCat || (hovered && hovered.name !== item.name)
                }
                onHover={setHovered}
              />
            ))}
          </div>
        );
      })}

      {/* central tech core */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
        <span
          className="flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-bg"
          style={{ boxShadow: "0 0 26px -6px var(--accent)" }}
        >
          <svg
            className="h-7 w-7 text-accent"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect x="4" y="4" width="16" height="16" rx="2" />
            <rect x="9" y="9" width="6" height="6" />
            <path d="M15 2v2M15 20v2M2 15h2M2 9h2M20 15h2M20 9h2M9 2v2M9 20v2" />
          </svg>
        </span>
      </div>
    </div>
  );
}

function GridList({ visible, query, t }) {
  return (
    <ul
      key={`${query}`}
      className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4"
    >
      {visible.map((item, i) => {
        const s = styleFor(item.category);
        const brand = brandColor(item.name);
        const icon = resolveTech(item.name);
        return (
          <li
            key={item.name}
            style={{
              animation: "tech-chip-in .35s ease both",
              animationDelay: `${Math.min(i, 24) * 16}ms`,
              ["--tile-accent"]: brand || "var(--accent)",
            }}
          >
            <div className="group flex h-full items-center gap-3 rounded-xl border border-border bg-surface px-3.5 py-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md hover:[border-color:var(--tile-accent)]">
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition group-hover:scale-110"
                style={{ backgroundColor: brand ? `${brand}1a` : "var(--hover)" }}
              >
                {icon ? (
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    style={{ fill: brand || "currentColor" }}
                    aria-hidden="true"
                  >
                    <path d={icon.path} />
                  </svg>
                ) : (
                  <span className={`text-xs font-bold ${s.text}`}>
                    {monogram(item.name)}
                  </span>
                )}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-text">
                  {item.name}
                </span>
                <span className="flex items-center gap-1.5 text-[0.7rem] text-muted">
                  <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} aria-hidden="true" />
                  {item.category}
                </span>
              </span>
            </div>
          </li>
        );
      })}
      {visible.length === 0 && (
        <li className="col-span-full py-4 text-sm text-muted">
          {t.noMatches} “{query}”.
        </li>
      )}
    </ul>
  );
}

export default function TechExplorer({ groups = [], strings = {} }) {
  const t = {
    all: "All",
    search: "Filter technologies…",
    builtWith: "Built with React",
    showing: "showing",
    technologies: "technologies",
    noMatches: "No technologies match",
    orbit: "Orbit",
    list: "List",
    hint: "Live React island — hover to pause the orbit",
    explore: "Hover a planet",
    ...strings,
  };

  const all = useMemo(
    () =>
      groups.flatMap((g) =>
        (g.items || []).map((name) => ({ name, category: g.category })),
      ),
    [groups],
  );
  const categories = useMemo(
    () => groups.map((g) => g.category).filter(Boolean),
    [groups],
  );

  // Smaller categories go on inner rings to avoid crowding the orbit.
  const rings = useMemo(
    () =>
      groups
        .filter((g) => (g.items || []).length)
        .map((g) => ({
          category: g.category,
          items: g.items.map((name) => ({ name, category: g.category })),
        }))
        .sort((a, b) => a.items.length - b.items.length)
        .slice(0, RADII.length),
    [groups],
  );

  const [mode, setMode] = useState("orbit");
  const [hovered, setHovered] = useState(null);
  const [activeCat, setActiveCat] = useState(null);
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");

  const visible = useMemo(
    () =>
      all.filter(
        (item) =>
          (filter === "All" || item.category === filter) &&
          item.name.toLowerCase().includes(query.trim().toLowerCase()),
      ),
    [all, filter, query],
  );

  const countFor = (cat) =>
    cat === "All" ? all.length : all.filter((i) => i.category === cat).length;

  return (
    <section className="mt-10" aria-label={`${all.length} ${t.technologies}`}>
      <div className="rounded-2xl border border-border bg-surface/40 p-5 shadow-sm sm:p-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Glowing React atom — the React signal (no text needed) */}
          <span
            role="img"
            className="core-pulse inline-flex h-16 w-16 items-center justify-center rounded-full border border-border bg-bg"
            style={{ boxShadow: `0 0 22px -4px ${REACT_CYAN}cc` }}
            aria-label={t.builtWith}
            title={t.builtWith}
          >
            <ReactAtom className="h-10 w-10" />
          </span>

          {/* View toggle */}
          <div
            className="inline-flex rounded-lg border border-border bg-bg p-0.5 text-sm font-medium"
            role="group"
          >
            {[
              { id: "orbit", label: t.orbit },
              { id: "list", label: t.list },
            ].map((v) => (
              <button
                key={v.id}
                type="button"
                aria-pressed={mode === v.id}
                onClick={() => setMode(v.id)}
                className={`rounded-md px-3 py-1 transition ${
                  mode === v.id
                    ? "bg-accent-strong text-accent-contrast shadow-sm"
                    : "text-muted hover:text-text"
                }`}
              >
                {v.label}
              </button>
            ))}
          </div>
        </div>

        {mode === "orbit" ? (
          <>
            <Orbit
              rings={rings}
              hovered={hovered}
              setHovered={setHovered}
              activeCat={activeCat}
            />

            {/* Category legend — hover to spotlight a ring */}
            <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
              {rings.map((ring) => (
                <li key={ring.category}>
                  <button
                    type="button"
                    onMouseEnter={() => setActiveCat(ring.category)}
                    onMouseLeave={() => setActiveCat(null)}
                    onFocus={() => setActiveCat(ring.category)}
                    onBlur={() => setActiveCat(null)}
                    className="inline-flex items-center gap-2 text-xs text-muted transition hover:text-text"
                  >
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${styleFor(ring.category).dot}`}
                      aria-hidden="true"
                    />
                    {ring.category}
                    <span className="tabular-nums text-muted">
                      {ring.items.length}
                    </span>
                  </button>
                </li>
              ))}
            </ul>

            <p className="mt-4 text-center font-mono text-[0.7rem] text-muted">
              <span style={{ color: REACT_CYAN }}>⚛</span> {t.hint}
            </p>
          </>
        ) : (
          <>
            {/* Filter tabs */}
            <div className="mt-5 flex flex-wrap gap-2">
              {["All", ...categories].map((cat) => {
                const isActive = filter === cat;
                const s = cat === "All" ? FALLBACK : styleFor(cat);
                return (
                  <button
                    key={cat}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => setFilter(cat)}
                    className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium transition ${
                      isActive
                        ? "border-accent-strong bg-accent-strong text-accent-contrast shadow-sm"
                        : "border-border text-muted hover:text-text"
                    }`}
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${isActive ? "bg-accent-contrast" : s.dot}`}
                      aria-hidden="true"
                    />
                    {cat === "All" ? t.all : cat}
                    <span
                      className={`rounded-full px-1.5 text-xs tabular-nums ${
                        isActive ? "bg-black/15 text-accent-contrast" : "bg-bg text-muted"
                      }`}
                    >
                      {countFor(cat)}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Search */}
            <div className="relative mt-4">
              <svg
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t.search}
                aria-label={t.search}
                className="w-full rounded-lg border border-border bg-bg py-2 pl-9 pr-9 text-sm text-text outline-none transition placeholder:text-muted/70 focus:border-accent focus:ring-2 focus:ring-accent/30"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Clear"
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted transition hover:bg-hover hover:text-text"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            <GridList visible={visible} query={query} t={t} />
          </>
        )}
      </div>
    </section>
  );
}
