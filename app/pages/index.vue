<script setup>
import { NuxtLink } from '#components';

// Pool size is the entry count in app/data/countries.js (countries + territories +
// UK home nations). Hardcoded on purpose — recount if that file changes.
const stats = [
    { value: '252', label: 'Countries & territories' },
    { value: '4', label: 'Game modes' },
    { value: '~2 min', label: 'Per round' },
];

const modes = [
    {
        n: '01',
        kicker: 'Classic',
        title: 'Guess the flag',
        blurb: 'The whole flag, four choices. The baseline drill — start here.',
        length: '10 questions',
        level: 'All levels',
        art: 'bars',
        is: NuxtLink,
        link: { to: '/games/flags' },
    },
    {
        n: '02',
        kicker: 'Detail',
        title: 'Zoomed-in flag',
        blurb: 'A single crop — a corner, a star, a stripe. Read the detail, name the country.',
        length: '10 questions',
        level: 'Hard',
        art: 'zoom',
        is: 'a',
        link: { href: '#' },
    },
    {
        n: '03',
        kicker: 'Shape',
        title: 'Country from outline',
        blurb: 'Borders only, no labels, no scale cue. Silhouette recognition.',
        length: '10 questions',
        level: 'Medium',
        art: 'outline',
        is: 'a',
        link: { href: '#' },
    },
    {
        n: '04',
        kicker: 'Cities',
        title: 'Capital to country',
        blurb: 'One capital city per round. Four countries. No map to lean on.',
        length: '10 questions',
        level: 'Medium',
        art: 'capital',
        is: 'a',
        link: { href: '#' },
    },
];

const barHeights = [42, 56, 30, 48, 22];

const marqueeCodes = [
    'jp', 'br', 'ch', 'za', 'kr', 'gr', 'ca', 'ar', 'pt', 'gb', 'de', 'in',
    'mx', 'au', 'no', 'eg', 'ke', 'th', 'pe', 'is', 'ma', 'vn', 'fi', 'uy',
];
// Doubled so the -50% translate loops seamlessly.
const marqueeLoop = [...marqueeCodes, ...marqueeCodes];

const flagSrc = code => `https://flagcdn.com/w320/${code}.png`;
</script>

<template>
    <main class="home">
        <div class="home-grid" aria-hidden="true" />
        <div class="home-blob" aria-hidden="true" />

        <div class="home-inner">
            <header class="topbar">
                <div class="brand">
                    <span class="brand-mark" aria-hidden="true" />
                    <span class="brand-name">Flag Game</span>
                </div>
                <div class="topbar-right">
                    <span class="tag tag-outline beta-tag">Beta</span>
                </div>
            </header>

            <section class="hero">
                <div class="hero-copy">
                    <div class="hero-kick">
                        <span class="hero-kick-line" aria-hidden="true" />
                        <span class="hero-kick-text">Four ways to read the world</span>
                    </div>
                    <h1 class="hero-title">Know every flag on the map.</h1>
                    <p class="hero-lead">
                        Short drills built from all 252 countries and territories on the map.
                        Pick a mode, take ten questions, watch the gaps close.
                    </p>
                    <div class="hero-cta">
                        <NuxtLink to="/games/flags" class="btn btn-primary hero-cta-btn">Quick play</NuxtLink>
                        <span class="hero-cta-note">10 questions · ~2 min</span>
                    </div>
                </div>

                <div class="hero-stats">
                    <div v-for="stat in stats" :key="stat.label" class="stat-row">
                        <span class="stat-value">{{ stat.value }}</span>
                        <span class="stat-label">{{ stat.label }}</span>
                    </div>
                </div>
            </section>

            <div class="marquee" aria-hidden="true">
                <div class="marquee-track">
                    <img
                        v-for="(code, i) in marqueeLoop"
                        :key="`${code}-${i}`"
                        class="marquee-flag"
                        :src="flagSrc(code)"
                        alt=""
                    >
                </div>
            </div>

            <section class="modes">
                <div class="modes-head">
                    <h2 class="modes-title">Choose a mode</h2>
                    <span class="modes-note">Each mode keeps its own score</span>
                </div>

                <div class="modes-grid">
                    <component
                        :is="mode.is"
                        v-for="mode in modes"
                        :key="mode.n"
                        v-bind="mode.link"
                        class="mode-card"
                    >
                        <div class="mode-card-top">
                            <span class="mode-kicker">{{ mode.kicker }}</span>
                            <span class="mode-num">{{ mode.n }}</span>
                        </div>

                        <div class="mode-art" aria-hidden="true">
                            <div v-if="mode.art === 'bars'" class="art-bars">
                                <span
                                    v-for="(h, i) in barHeights"
                                    :key="i"
                                    class="art-bar"
                                    :class="{ 'art-bar-lit': i % 2 === 0 }"
                                    :style="{ height: `${h}px` }"
                                />
                            </div>

                            <div v-else-if="mode.art === 'zoom'" class="art-zoom">
                                <span class="art-zoom-field" />
                                <span class="art-zoom-lens" />
                                <span class="art-zoom-tick" />
                            </div>

                            <div v-else-if="mode.art === 'outline'" class="art-outline" />

                            <div v-else class="art-capital">
                                <span class="art-capital-h" />
                                <span class="art-capital-v" />
                                <span class="art-capital-ring" />
                                <span class="art-capital-dot" />
                            </div>
                        </div>

                        <div class="mode-body">
                            <span class="mode-title">{{ mode.title }}</span>
                            <span class="mode-blurb">{{ mode.blurb }}</span>
                        </div>

                        <div class="mode-foot">
                            <div class="mode-tags">
                                <span class="tag tag-neutral mode-tag">{{ mode.length }}</span>
                                <span class="tag tag-neutral mode-tag">{{ mode.level }}</span>
                            </div>
                            <span class="mode-play">Play →</span>
                        </div>
                    </component>
                </div>
            </section>

            <footer class="home-foot">
                <span>Flag artwork from open data · scores stay on this device</span>
                <div class="home-foot-links">
                    <a href="#">How scoring works</a>
                    <a href="#">Suggest a mode</a>
                </div>
            </footer>
        </div>
    </main>
</template>

<style scoped>
.home {
    position: relative;
    min-height: 100vh;
    overflow: hidden;
    color: var(--color-text);
    font-family: var(--font-body);
    background:
        radial-gradient(900px 520px at 8% -12%, #232750 0%, rgba(0, 0, 0, 0) 62%),
        radial-gradient(700px 460px at 88% 8%, #1e2140 0%, rgba(0, 0, 0, 0) 58%),
        var(--color-bg);
}

.home-grid {
    position: absolute;
    inset: 0;
    pointer-events: none;
    opacity: 0.5;
    background-image:
        linear-gradient(color-mix(in srgb, var(--color-text) 4%, transparent) 1px, transparent 1px),
        linear-gradient(90deg, color-mix(in srgb, var(--color-text) 4%, transparent) 1px, transparent 1px);
    background-size: 64px 64px;
    mask-image: radial-gradient(720px 520px at 20% 0%, #000 0%, transparent 78%);
}

.home-blob {
    position: absolute;
    top: -140px;
    left: -120px;
    width: 520px;
    height: 520px;
    pointer-events: none;
    border-radius: 50%;
    background: radial-gradient(circle, color-mix(in srgb, var(--color-accent) 26%, transparent) 0%, rgba(0, 0, 0, 0) 68%);
    filter: blur(12px);
    animation: noct-pulse 9s ease-in-out infinite;
}

.home-inner {
    position: relative;
    width: 100%;
    max-width: 1180px;
    margin: 0 auto;
    padding: 64px 32px 88px;
    display: flex;
    flex-direction: column;
    gap: 56px;
}

/* — top bar — */
.topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
    flex-wrap: wrap;
}

.brand {
    display: flex;
    align-items: center;
    gap: 12px;
}

.brand-mark {
    position: relative;
    width: 26px;
    height: 26px;
    border: 1px solid var(--color-accent);
    border-radius: var(--radius-sm);
    box-shadow: 0 0 18px color-mix(in srgb, var(--color-accent) 30%, transparent);
}

.brand-mark::before,
.brand-mark::after {
    content: '';
    position: absolute;
    left: 6px;
    top: 5px;
}

.brand-mark::before {
    width: 2px;
    height: 15px;
    background: var(--color-accent);
}

.brand-mark::after {
    width: 11px;
    height: 7px;
    background: color-mix(in srgb, var(--color-accent) 55%, transparent);
}

.brand-name {
    font-family: var(--font-heading);
    font-weight: var(--font-heading-weight);
    font-size: 15px;
    letter-spacing: -0.01em;
}

.topbar-right {
    display: flex;
    align-items: center;
    gap: 20px;
}

.beta-tag {
    font-size: 10px;
}

/* — hero — */
.hero {
    display: grid;
    grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.85fr);
    gap: 56px;
    align-items: end;
}

.hero-copy {
    display: flex;
    flex-direction: column;
    gap: 22px;
}

.hero-kick {
    display: flex;
    align-items: center;
    gap: 12px;
}

.hero-kick-line {
    width: 34px;
    height: 2px;
    border-radius: 2px;
    background: var(--color-accent);
}

.hero-kick-text {
    font-size: 10px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--color-accent);
}

.hero-title {
    margin: 0;
    max-width: 16ch;
    font-family: var(--font-heading);
    font-weight: var(--font-heading-weight);
    font-size: clamp(46px, 6vw, 78px);
    line-height: 0.96;
    letter-spacing: -0.035em;
    text-wrap: balance;
}

.hero-lead {
    margin: 0;
    max-width: 46ch;
    font-size: 16px;
    line-height: 1.55;
    color: color-mix(in srgb, var(--color-text) 66%, transparent);
    text-wrap: pretty;
}

.hero-cta {
    display: flex;
    align-items: center;
    gap: 14px;
    flex-wrap: wrap;
    margin-top: 6px;
}

.hero-cta-btn {
    padding: 12px 22px;
    font-size: 14px;
}

.hero-cta-note {
    font-size: 13px;
    color: color-mix(in srgb, var(--color-text) 48%, transparent);
}

.hero-stats {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 14px;
    padding: 26px 0 26px 28px;
    border-left: 1px solid var(--color-divider);
}

.stat-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 18px;
}

.stat-value {
    font-family: var(--font-heading);
    font-size: 30px;
    letter-spacing: -0.025em;
    font-variant-numeric: tabular-nums;
}

.stat-label {
    max-width: 14ch;
    font-size: 11px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    text-align: right;
    color: color-mix(in srgb, var(--color-text) 44%, transparent);
}

/* — marquee — */
.marquee {
    position: relative;
    height: 74px;
    overflow: hidden;
    mask-image: linear-gradient(90deg, transparent 0%, #000 14%, #000 86%, transparent 100%);
}

.marquee-track {
    display: flex;
    gap: 14px;
    width: max-content;
    animation: noct-drift 46s linear infinite;
}

.marquee-flag {
    flex: 0 0 auto;
    width: 78px;
    height: 52px;
    object-fit: cover;
    border-radius: var(--radius-sm);
    opacity: 0.5;
    mix-blend-mode: lighten;
}

/* — mode cards — */
.modes {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.modes-head {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 20px;
    flex-wrap: wrap;
}

.modes-title {
    margin: 0;
    font-family: var(--font-heading);
    font-weight: var(--font-heading-weight);
    font-size: 22px;
    letter-spacing: -0.02em;
}

.modes-note {
    font-size: 12px;
    color: color-mix(in srgb, var(--color-text) 42%, transparent);
}

.modes-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(268px, 1fr));
    gap: 16px;
}

.mode-card {
    display: flex;
    flex-direction: column;
    gap: 16px;
    min-height: 328px;
    padding: 20px 20px 18px;
    text-decoration: none;
    color: var(--color-text);
    border: 1px solid var(--color-divider);
    border-radius: var(--radius-lg);
    background: linear-gradient(165deg, #21243a 0%, var(--color-surface) 100%);
    box-shadow: var(--shadow-sm);
    transition: transform 0.22s ease, border-color 0.22s ease, box-shadow 0.22s ease;
}

.mode-card:hover {
    transform: translateY(-3px);
    border-color: var(--color-accent);
    box-shadow: var(--shadow-md), 0 0 32px color-mix(in srgb, var(--color-accent) 20%, transparent);
}

.mode-card:focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 2px;
}

.mode-card-top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 14px;
}

.mode-kicker {
    font-family: var(--font-heading);
    font-size: 11px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--color-accent-300);
}

.mode-num {
    font-family: var(--font-heading);
    font-size: 11px;
    font-variant-numeric: tabular-nums;
    color: color-mix(in srgb, var(--color-text) 30%, transparent);
}

.mode-art {
    height: 104px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    border-radius: var(--radius-sm);
    background: linear-gradient(160deg, color-mix(in srgb, var(--color-accent) 9%, transparent) 0%, rgba(0, 0, 0, 0) 100%);
}

.mode-body {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.mode-title {
    font-family: var(--font-heading);
    font-weight: var(--font-heading-weight);
    font-size: 19px;
    letter-spacing: -0.015em;
    color: var(--color-text);
}

.mode-blurb {
    font-size: 13px;
    line-height: 1.5;
    color: color-mix(in srgb, var(--color-text) 60%, transparent);
    text-wrap: pretty;
}

.mode-foot {
    margin-top: auto;
    padding-top: 14px;
    border-top: 1px solid var(--color-divider);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
}

.mode-tags {
    display: flex;
    gap: 6px;
}

.mode-tag {
    font-size: 9px;
}

.mode-play {
    font-size: 12px;
    letter-spacing: 0.04em;
    color: var(--color-accent-300);
}

/* — card art — */
.art-bars {
    display: flex;
    gap: 6px;
    align-items: flex-end;
    height: 56px;
}

.art-bar {
    width: 9px;
    border-radius: 2px;
    background: color-mix(in srgb, var(--color-accent) 30%, transparent);
}

.art-bar-lit {
    background: var(--color-accent);
    box-shadow: 0 0 14px color-mix(in srgb, var(--color-accent) 45%, transparent);
}

.art-zoom {
    position: relative;
    width: 92px;
    height: 62px;
}

.art-zoom-field {
    position: absolute;
    inset: 0;
    border-radius: 3px;
    background: repeating-linear-gradient(90deg, color-mix(in srgb, var(--color-accent) 22%, transparent) 0 12px, transparent 12px 24px);
}

.art-zoom-lens {
    position: absolute;
    left: 26px;
    top: 10px;
    width: 42px;
    height: 42px;
    border-radius: 50%;
    border: 1.5px solid var(--color-accent);
    box-shadow:
        0 0 18px color-mix(in srgb, var(--color-accent) 40%, transparent),
        inset 0 0 14px color-mix(in srgb, var(--color-accent) 18%, transparent);
}

.art-zoom-tick {
    position: absolute;
    left: 64px;
    top: 48px;
    width: 20px;
    height: 1.5px;
    background: var(--color-accent);
    transform: rotate(38deg);
    transform-origin: left center;
}

.art-outline {
    width: 78px;
    height: 58px;
    border: 1.5px solid var(--color-accent);
    border-radius: 42% 12% 34% 18% / 22% 40% 16% 44%;
    box-shadow: 0 0 20px color-mix(in srgb, var(--color-accent) 30%, transparent);
    background: linear-gradient(150deg, color-mix(in srgb, var(--color-accent) 14%, transparent), transparent);
}

.art-capital {
    position: relative;
    width: 92px;
    height: 62px;
}

.art-capital-h,
.art-capital-v {
    position: absolute;
    background: color-mix(in srgb, var(--color-accent) 26%, transparent);
}

.art-capital-h {
    left: 0;
    top: 30px;
    width: 92px;
    height: 1px;
}

.art-capital-v {
    left: 46px;
    top: 0;
    width: 1px;
    height: 62px;
}

.art-capital-ring {
    position: absolute;
    left: 30px;
    top: 14px;
    width: 33px;
    height: 33px;
    border-radius: 50%;
    border: 1px solid color-mix(in srgb, var(--color-accent) 40%, transparent);
}

.art-capital-dot {
    position: absolute;
    left: 41px;
    top: 25px;
    width: 11px;
    height: 11px;
    border-radius: 50%;
    background: var(--color-accent);
    box-shadow: 0 0 16px color-mix(in srgb, var(--color-accent) 60%, transparent);
}

/* — footer — */
.home-foot {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    flex-wrap: wrap;
    padding-top: 8px;
    font-size: 12px;
    color: color-mix(in srgb, var(--color-text) 38%, transparent);
}

.home-foot-links {
    display: flex;
    gap: 18px;
}

.home-foot-links a {
    color: var(--color-accent-300);
    text-decoration: none;
}

.home-foot-links a:hover {
    color: var(--color-accent-200);
}

@keyframes noct-drift {
    from { transform: translateX(0); }
    to { transform: translateX(-50%); }
}

@keyframes noct-pulse {
    0%, 100% { opacity: 0.5; }
    50% { opacity: 1; }
}

@media (max-width: 860px) {
    .hero {
        grid-template-columns: 1fr;
        gap: 32px;
        align-items: start;
    }

    .hero-stats {
        padding: 22px 0 0;
        border-left: none;
        border-top: 1px solid var(--color-divider);
    }
}

@media (max-width: 560px) {
    .home-inner {
        padding: 40px 20px 64px;
        gap: 40px;
    }
}

@media (prefers-reduced-motion: reduce) {
    .home-blob,
    .marquee-track {
        animation: none;
    }
}
</style>
