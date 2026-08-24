<script setup>
import { computed, onBeforeMount, onBeforeUnmount } from 'vue';

const flagGameStore = useFlagGameStore();
const difficulties = [
    { label: 'Easy', value: 1 },
    { label: 'Medium', value: 2 },
    { label: 'Hard', value: 3 },
];
const feedback = computed(() => flagGameStore.isSelectedAnswerCorrect
    ? 'Correct!'
    : `Incorrect. The answer is ${flagGameStore.currentCountry?.name}.`);

const progress = computed(() => {
    if (flagGameStore.phase === 'completed') return 100;
    if (flagGameStore.phase !== 'playing') return 0;

    const answered = flagGameStore.currentQuestion - (flagGameStore.selectedAnswer === null ? 1 : 0);
    return (answered / flagGameStore.totalQuestions) * 100;
});

const grade = computed(() => {
    const score = flagGameStore.score;
    if (score <= 4) return 'Worth another lap.';
    if (score <= 6) return 'Solid ground, a few gaps.';
    if (score <= 8) return 'Strong — you know the atlas.';
    return 'Near-perfect recall.';
});

let feedbackTimer;

function scheduleNextQuestion() {
    clearTimeout(feedbackTimer);
    feedbackTimer = setTimeout(() => flagGameStore.advanceQuestion(), 1500);
}

function selectAnswer(code) {
    if (flagGameStore.submitAnswer(code)) scheduleNextQuestion();
}

function optionClass(code) {
    if (flagGameStore.selectedAnswer === null) return '';
    if (code === flagGameStore.currentQuestionData.answerCode) return 'correct';
    if (code === flagGameStore.selectedAnswer) return 'incorrect';
    return 'muted';
}

onBeforeMount(() => {
    flagGameStore.hydrate();
    if (flagGameStore.phase === 'playing' && flagGameStore.selectedAnswer !== null) {
        scheduleNextQuestion();
    }
});

onBeforeUnmount(() => clearTimeout(feedbackTimer));
</script>

<template>
    <main class="flag-game">
        <div class="shell">
            <header class="masthead">
                <div class="titles">
                    <p class="kicker">Geography drill</p>
                    <h1>Flag Guessing Game</h1>
                </div>

                <div v-if="flagGameStore.phase === 'playing'" class="readout">
                    <div class="stat">
                        <span class="stat-label">Question</span>
                        <span class="stat-value">{{ flagGameStore.currentQuestion }} / {{ flagGameStore.totalQuestions }}</span>
                    </div>
                    <span class="stat-divider" aria-hidden="true" />
                    <div class="stat">
                        <span class="stat-label">Score</span>
                        <span class="stat-value accent">{{ flagGameStore.score }}</span>
                    </div>
                </div>
            </header>

            <div class="track" aria-hidden="true">
                <div class="track-fill" :style="{ width: `${progress}%` }" />
            </div>

            <template v-if="flagGameStore.phase === 'selection'">
                <section class="start">
                    <h2>Choose a difficulty to start a {{ flagGameStore.totalQuestions }}-question game.</h2>
                    <div class="difficulty-options">
                        <button
                            v-for="difficulty in difficulties"
                            :key="difficulty.value"
                            type="button"
                            class="choice"
                            @click="flagGameStore.startGame(difficulty.value)"
                        >
                            {{ difficulty.label }}
                        </button>
                    </div>
                </section>
            </template>

            <template v-else-if="flagGameStore.phase === 'playing' && flagGameStore.currentCountry">
                <section class="round">
                    <figure class="flag-panel">
                        <figcaption>Identify</figcaption>
                        <img
                            class="flag-image"
                            :src="flagGameStore.getFlagImage(flagGameStore.currentCountry.code)"
                            alt="Flag to identify"
                        >
                    </figure>

                    <div class="quiz">
                        <h2>Which country or territory does this flag belong to?</h2>

                        <div class="answer-options">
                            <button
                                v-for="country in flagGameStore.currentOptions"
                                :key="country.code"
                                type="button"
                                class="choice"
                                :class="optionClass(country.code)"
                                :disabled="flagGameStore.selectedAnswer !== null"
                                @click="selectAnswer(country.code)"
                            >
                                <span>{{ country.name }}</span>
                                <span
                                    v-if="optionClass(country.code) === 'correct'"
                                    class="choice-mark"
                                >Correct</span>
                                <span
                                    v-else-if="optionClass(country.code) === 'incorrect'"
                                    class="choice-mark"
                                >Your pick</span>
                            </button>
                        </div>

                        <p class="sr-only" aria-live="polite">{{ flagGameStore.selectedAnswer === null ? '' : feedback }}</p>
                    </div>
                </section>
            </template>

            <template v-else>
                <section class="complete">
                    <p class="kicker">Round complete</p>
                    <p class="final-score">
                        <span class="final-score-value">{{ flagGameStore.score }}</span>
                        <span class="final-score-of">of {{ flagGameStore.totalQuestions }}</span>
                    </p>
                    <p class="grade">{{ grade }}</p>
                    <button type="button" class="btn btn-primary" @click="flagGameStore.resetGame()">Play again</button>
                </section>
            </template>
        </div>
    </main>
</template>

<style>
body {
    margin: 0;
}
</style>

<style scoped>
/* Feedback colours — the one place this screen steps outside the mono accent,
   because right/wrong has to read instantly. */
.flag-game {
    --answer-correct: #3fb27f;
    --answer-wrong: #d9534f;

    min-height: 100vh;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    padding: 56px 32px 72px;
    background: radial-gradient(1200px 600px at 12% -10%, #1d2036 0%, var(--color-bg) 60%);
    color: var(--color-text);
    font-family: var(--font-body);
}

.shell {
    width: 100%;
    max-width: 1080px;
    display: flex;
    flex-direction: column;
    gap: 34px;
}

.masthead {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: var(--space-8);
    flex-wrap: wrap;
}

.titles {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
}

.kicker {
    margin: 0;
    font-size: 10px;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--color-accent);
}

h1 {
    margin: 0;
    font-size: 38px;
    letter-spacing: -0.02em;
}

.readout {
    display: flex;
    align-items: center;
    gap: var(--space-8);
}

.stat {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.stat-label {
    font-size: 10px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: color-mix(in srgb, var(--color-text) 45%, transparent);
}

.stat-value {
    font-family: var(--font-heading);
    font-weight: var(--font-heading-weight);
    font-size: 20px;
    font-variant-numeric: tabular-nums;
}

.stat-value.accent {
    color: var(--color-accent-300);
}

.stat-divider {
    width: 1px;
    height: 34px;
    background: var(--color-divider);
}

.track {
    height: 2px;
    border-radius: 2px;
    overflow: hidden;
    background: color-mix(in srgb, var(--color-text) 10%, transparent);
}

.track-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--color-accent-700), var(--color-accent));
    box-shadow: 0 0 18px var(--color-accent-600);
    transition: width 0.45s ease;
}

.round {
    display: grid;
    grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr);
    gap: 48px;
    align-items: center;
}

.flag-panel {
    position: relative;
    margin: 0;
    padding: 34px;
    border-radius: var(--radius-lg);
    background: linear-gradient(160deg, #21243a 0%, var(--color-surface) 100%);
    box-shadow: var(--shadow-md);
}

.flag-panel figcaption {
    position: absolute;
    top: 22px;
    left: 22px;
    font-size: 10px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: color-mix(in srgb, var(--color-text) 38%, transparent);
}

.flag-image {
    display: block;
    width: 100%;
    height: 260px;
    margin-top: 22px;
    object-fit: contain;
    border-radius: var(--radius-sm);
    filter: drop-shadow(0 18px 44px rgba(0, 0, 0, 0.6));
}

.quiz {
    display: flex;
    flex-direction: column;
    gap: 22px;
}

h2 {
    margin: 0;
    font-size: 26px;
    line-height: 1.25;
    letter-spacing: -0.015em;
    max-width: 22ch;
    text-wrap: pretty;
}

.difficulty-options,
.answer-options {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--space-4);
}

.difficulty-options {
    grid-template-columns: repeat(3, minmax(0, 1fr));
}

.start {
    display: flex;
    flex-direction: column;
    gap: 22px;
    max-width: 520px;
}

.choice {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-3);
    min-height: 56px;
    padding: var(--space-6) 18px;
    text-align: left;
    font-family: var(--font-heading);
    font-weight: var(--font-heading-weight);
    font-size: 15px;
    color: var(--color-text);
    background: transparent;
    border: 1px solid color-mix(in srgb, var(--color-accent) 45%, transparent);
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: background 0.18s ease, border-color 0.18s ease, color 0.18s ease;
}

.choice:hover:not(:disabled) {
    background: var(--color-accent-900);
    border-color: var(--color-accent);
}

.choice:active:not(:disabled) {
    background: color-mix(in srgb, var(--color-accent) 24%, transparent);
    border-color: var(--color-accent-400);
}

.choice:focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 2px;
}

.choice:disabled {
    cursor: default;
    border-color: color-mix(in srgb, var(--color-text) 8%, transparent);
    color: color-mix(in srgb, var(--color-text) 34%, transparent);
}

.choice-mark {
    font-size: 11px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
}

.choice.correct:disabled {
    border-color: var(--answer-correct);
    background: color-mix(in srgb, var(--answer-correct) 20%, transparent);
    color: color-mix(in srgb, var(--answer-correct) 45%, var(--color-text));
    box-shadow: 0 0 24px color-mix(in srgb, var(--answer-correct) 24%, transparent);
}

.choice.correct .choice-mark {
    color: var(--answer-correct);
}

.choice.incorrect:disabled {
    border-color: var(--answer-wrong);
    background: color-mix(in srgb, var(--answer-wrong) 18%, transparent);
    color: color-mix(in srgb, var(--answer-wrong) 40%, var(--color-text));
}

.choice.incorrect .choice-mark {
    color: var(--answer-wrong);
}

.complete {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-6);
    padding-top: var(--space-4);
}

.final-score {
    display: flex;
    align-items: baseline;
    gap: var(--space-4);
    margin: 0;
}

.final-score-value {
    font-family: var(--font-heading);
    font-weight: var(--font-heading-weight);
    font-size: 86px;
    line-height: 1;
    letter-spacing: -0.03em;
    font-variant-numeric: tabular-nums;
}

.final-score-of {
    font-size: 20px;
    color: color-mix(in srgb, var(--color-text) 50%, transparent);
}

.grade {
    margin: 0;
    max-width: 34ch;
    font-size: 15px;
    color: color-mix(in srgb, var(--color-text) 68%, transparent);
    text-wrap: pretty;
}

.complete .btn {
    margin-top: var(--space-2);
    padding: 10px 20px;
    font-size: 14px;
    white-space: nowrap;
}

.sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: -1px;
    padding: 0;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
    border: 0;
}

@media (max-width: 900px) {
    .round {
        grid-template-columns: 1fr;
        gap: 32px;
    }
}

@media (max-width: 560px) {
    .flag-game {
        padding: 32px 16px 48px;
    }

    h1 {
        font-size: 30px;
    }

    h2 {
        font-size: 21px;
    }

    .answer-options,
    .difficulty-options {
        grid-template-columns: 1fr;
    }

    .flag-image {
        height: 180px;
    }
}
</style>
