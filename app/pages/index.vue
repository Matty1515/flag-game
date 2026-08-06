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
    return '';
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
        <section class="game-card">
            <h1>Flag Guessing Game</h1>

            <template v-if="flagGameStore.phase === 'selection'">
                <p>Choose a difficulty to start a 10-question game.</p>
                <div class="difficulty-options">
                    <button
                        v-for="difficulty in difficulties"
                        :key="difficulty.value"
                        type="button"
                        @click="flagGameStore.startGame(difficulty.value)"
                    >
                        {{ difficulty.label }}
                    </button>
                </div>
            </template>

            <template v-else-if="flagGameStore.phase === 'playing' && flagGameStore.currentCountry">
                <div class="game-progress">
                    <p>Question {{ flagGameStore.currentQuestion }} of {{ flagGameStore.totalQuestions }}</p>
                    <p>Score: {{ flagGameStore.score }}</p>
                </div>

                <img
                    class="flag-image"
                    :src="flagGameStore.getFlagImage(flagGameStore.currentCountry.code)"
                    alt="Flag to identify"
                >

                <h2>Which country or territory does this flag belong to?</h2>
                <div class="answer-options">
                    <button
                        v-for="country in flagGameStore.currentOptions"
                        :key="country.code"
                        type="button"
                        :class="optionClass(country.code)"
                        :disabled="flagGameStore.selectedAnswer !== null"
                        @click="selectAnswer(country.code)"
                    >
                        {{ country.name }}
                    </button>
                </div>

                <p v-if="flagGameStore.selectedAnswer !== null" class="feedback" aria-live="polite">
                    {{ feedback }}
                </p>
            </template>

            <template v-else>
                <h2>Game complete!</h2>
                <p class="final-score">You scored {{ flagGameStore.score }} out of {{ flagGameStore.totalQuestions }}.</p>
                <button type="button" @click="flagGameStore.resetGame()">Play again</button>
            </template>
        </section>
    </main>
</template>

<style>
body {
    margin: 0;
}
</style>

<style scoped>
.flag-game {
    min-height: 100vh;
    display: grid;
    place-items: center;
    padding: 24px;
    box-sizing: border-box;
    background: #f4f6f8;
    font-family: Arial, sans-serif;
}

.game-card {
    width: min(100%, 720px);
    padding: clamp(24px, 5vw, 48px);
    box-sizing: border-box;
    border-radius: 12px;
    background: #fff;
    text-align: center;
    box-shadow: 0 8px 28px rgba(0, 0, 0, 0.08);
}

h1 {
    margin-top: 0;
}

.game-progress {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    font-weight: 700;
}

.flag-image {
    display: block;
    width: min(100%, 420px);
    height: 240px;
    margin: 24px auto;
    object-fit: contain;
}

.difficulty-options,
.answer-options {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
    margin-top: 24px;
}

.difficulty-options {
    grid-template-columns: repeat(3, minmax(0, 1fr));
}

button {
    min-height: 48px;
    padding: 12px 18px;
    border: 2px solid #2463a9;
    border-radius: 8px;
    background: #2463a9;
    color: #fff;
    font: inherit;
    font-weight: 700;
    cursor: pointer;
}

button:hover:not(:disabled),
button:focus-visible {
    background: #194a82;
    border-color: #194a82;
}

button:focus-visible {
    outline: 3px solid #8bc4ff;
    outline-offset: 2px;
}

button:disabled {
    cursor: default;
    opacity: 0.65;
}

button.correct {
    background: #237a3b;
    border-color: #237a3b;
    opacity: 1;
}

button.incorrect {
    background: #b42318;
    border-color: #b42318;
    opacity: 1;
}

.feedback,
.final-score {
    margin: 24px 0 0;
    font-size: 1.2rem;
    font-weight: 700;
}

.final-score {
    margin-bottom: 24px;
}

@media (max-width: 560px) {
    .flag-game {
        padding: 12px;
    }

    .difficulty-options,
    .answer-options {
        grid-template-columns: 1fr;
    }

    .flag-image {
        height: 180px;
    }
}
</style>
