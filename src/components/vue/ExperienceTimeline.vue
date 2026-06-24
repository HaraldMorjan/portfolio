<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  experience: { type: Array, default: () => [] },
});

const activeSkill = ref(null);

// Skills that recur across 2+ roles make the most useful filters; single-role
// skills are still clickable from within a role card.
const filterSkills = computed(() => {
  const counts = new Map();
  for (const role of props.experience) {
    for (const s of role.skills || []) counts.set(s, (counts.get(s) || 0) + 1);
  }
  return [...counts.entries()]
    .filter(([, n]) => n >= 2)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([name]) => name);
});

const filtered = computed(() =>
  activeSkill.value
    ? props.experience.filter((r) => (r.skills || []).includes(activeSkill.value))
    : props.experience,
);

function toggleSkill(skill) {
  activeSkill.value = activeSkill.value === skill ? null : skill;
}

// --- date / text helpers (ported from the Astro version) -------------------
function splitHighlight(text) {
  const i = text.indexOf(": ");
  if (i > 0 && i < 40) return { label: text.slice(0, i), rest: text.slice(i + 2) };
  return { label: "", rest: text };
}

const MONTHS = {
  jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
  jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
};
function parseMonthYear(s) {
  const parts = s.trim().split(/\s+/);
  if (parts.length < 2) return null;
  const m = MONTHS[parts[0].slice(0, 3).toLowerCase()];
  const y = parseInt(parts[1], 10);
  if (m === undefined || isNaN(y)) return null;
  return { y, m };
}
function durationOf(period) {
  const [startStr, endStr] = period.split(/\s*[-\u2013]\s*/);
  const start = parseMonthYear(startStr || "");
  if (!start) return "";
  const now = new Date();
  const end = /present/i.test(endStr || "")
    ? { y: now.getFullYear(), m: now.getMonth() }
    : parseMonthYear(endStr || "");
  if (!end) return "";
  let months = (end.y - start.y) * 12 + (end.m - start.m) + 1;
  if (months < 1) months = 1;
  const yrs = Math.floor(months / 12);
  const mos = months % 12;
  const out = [];
  if (yrs) out.push(`${yrs} yr${yrs > 1 ? "s" : ""}`);
  if (mos) out.push(`${mos} mo${mos > 1 ? "s" : ""}`);
  return out.join(" ") || "1 mo";
}
</script>

<template>
  <div>
    <!-- Filter bar -->
    <div class="mt-6">
      <div class="flex flex-wrap items-center gap-2">
        <button
          type="button"
          class="rounded-md border px-2.5 py-1 font-mono text-xs transition"
          :class="
            activeSkill === null
              ? 'border-accent bg-accent text-accent-contrast'
              : 'border-border bg-surface text-muted hover:border-accent hover:text-text'
          "
          @click="activeSkill = null"
        >
          All
        </button>
        <button
          v-for="skill in filterSkills"
          :key="skill"
          type="button"
          class="rounded-md border px-2.5 py-1 font-mono text-xs transition"
          :class="
            activeSkill === skill
              ? 'border-accent bg-accent text-accent-contrast'
              : 'border-border bg-surface text-muted hover:border-accent hover:text-text'
          "
          @click="toggleSkill(skill)"
        >
          {{ skill }}
        </button>
      </div>
      <p class="mt-3 text-sm text-muted" aria-live="polite">
        <template v-if="activeSkill">
          Showing
          <span class="font-semibold text-text">{{ filtered.length }}</span>
          of {{ experience.length }} roles using
          <span class="font-medium text-accent">{{ activeSkill }}</span>
        </template>
        <template v-else>
          Filter {{ experience.length }} roles by a skill above, or tap any skill on a role.
        </template>
      </p>
    </div>

    <!-- Timeline -->
    <TransitionGroup
      tag="ol"
      name="role"
      class="relative mt-8 space-y-10 border-l border-border pl-6"
    >
      <li v-for="item in filtered" :key="item.role + item.period" class="relative">
        <span
          class="absolute -left-[31px] top-1.5 h-3 w-3 rounded-full border-2 border-bg bg-accent"
        />
        <h3 class="text-lg font-semibold text-text">
          {{ item.role }}
          <span class="text-accent"> @ {{ item.company }}</span>
        </h3>
        <p class="mt-1 font-mono text-sm text-muted">
          {{ item.period }}
          <span v-if="durationOf(item.period)" class="text-muted/70">
            · {{ durationOf(item.period) }}</span
          >
        </p>
        <p v-if="item.location" class="mt-0.5 font-mono text-xs text-muted">
          {{ item.location }}
        </p>
        <p class="mt-2 text-muted">{{ item.description }}</p>

        <ul v-if="item.highlights && item.highlights.length" class="mt-3 space-y-1.5">
          <li
            v-for="(h, hi) in item.highlights"
            :key="hi"
            class="flex gap-2 text-sm text-muted"
          >
            <span class="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
            <span>
              <span v-if="splitHighlight(h).label" class="font-medium text-text"
                >{{ splitHighlight(h).label }}: </span
              >{{ splitHighlight(h).rest }}
            </span>
          </li>
        </ul>

        <ul v-if="item.skills && item.skills.length" class="mt-4 flex flex-wrap gap-2">
          <li v-for="skill in item.skills" :key="skill">
            <button
              type="button"
              class="inline-flex items-center rounded-md border px-2.5 py-1 font-mono text-xs transition"
              :class="
                activeSkill === skill
                  ? 'border-accent bg-accent/10 text-text'
                  : 'border-border bg-surface text-muted hover:border-accent hover:text-text'
              "
              @click="toggleSkill(skill)"
            >
              {{ skill }}
            </button>
          </li>
        </ul>
      </li>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.role-enter-active,
.role-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.role-enter-from,
.role-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
/* Keep remaining items animating smoothly when one is filtered out. */
.role-move {
  transition: transform 0.3s ease;
}
</style>
