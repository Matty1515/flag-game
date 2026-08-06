import { defineStore } from 'pinia';
import { countries } from '~/data/countries';

const STORAGE_KEY = 'FlagGameStore';
const TOTAL_QUESTIONS = 10;

const defaultState = () => ({
    loading: false,
    phase: 'selection',
    difficulty: null,
    score: 0,
    currentQuestion: 1,
    totalQuestions: TOTAL_QUESTIONS,
    questions: [],
    selectedAnswer: null,
});

function shuffle(items) {
    const shuffled = [...items];

    for (let index = shuffled.length - 1; index > 0; index--) {
        const randomIndex = Math.floor(Math.random() * (index + 1));
        [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
    }

    return shuffled;
}

function isValidQuestion(question, difficulty) {
    if (!question || !countries[question.answerCode] || !Array.isArray(question.optionCodes)) return false;

    const uniqueOptions = new Set(question.optionCodes);
    return question.optionCodes.length === 4
        && uniqueOptions.size === 4
        && uniqueOptions.has(question.answerCode)
        && question.optionCodes.every(code => countries[code]?.difficulty === difficulty);
}

function isValidState(state) {
    const validPhase = ['selection', 'playing', 'completed'].includes(state.phase);
    const validDifficulty = state.phase === 'selection'
        ? state.difficulty === null
        : [1, 2, 3].includes(state.difficulty);
    const validProgress = Number.isInteger(state.score)
        && state.score >= 0
        && state.score <= TOTAL_QUESTIONS
        && Number.isInteger(state.currentQuestion)
        && state.currentQuestion >= 1
        && state.currentQuestion <= TOTAL_QUESTIONS;

    if (!validPhase || !validDifficulty || !validProgress) return false;
    if (state.phase === 'selection') return state.questions.length === 0 && state.selectedAnswer === null;

    const validQuestions = state.questions.length === TOTAL_QUESTIONS
        && new Set(state.questions.map(question => question.answerCode)).size === TOTAL_QUESTIONS
        && state.questions.every(question => isValidQuestion(question, state.difficulty));

    if (!validQuestions) return false;
    if (state.phase === 'completed') return state.selectedAnswer === null;
    if (state.selectedAnswer === null) return true;

    return state.questions[state.currentQuestion - 1].optionCodes.includes(state.selectedAnswer);
}

export const useFlagGameStore = defineStore('FlagGameStore', {
    state: () => defaultState(),

    getters: {
        currentQuestionData: state => state.questions[state.currentQuestion - 1] ?? null,
        currentCountry() {
            return countries[this.currentQuestionData?.answerCode] ?? null;
        },
        currentOptions() {
            return this.currentQuestionData?.optionCodes.map(code => countries[code]) ?? [];
        },
        isSelectedAnswerCorrect() {
            return this.selectedAnswer !== null
                && this.selectedAnswer === this.currentQuestionData?.answerCode;
        },
        getFlagImage: () => code => `https://flagcdn.com/${code.toLowerCase()}.svg`,
    },

    actions: {
        startGame(difficulty) {
            if (![1, 2, 3].includes(difficulty)) return false;

            const countryCodes = Object.values(countries)
                .filter(country => country.difficulty === difficulty)
                .map(country => country.code);
            const answerCodes = shuffle(countryCodes).slice(0, TOTAL_QUESTIONS);
            const questions = answerCodes.map(answerCode => {
                const distractors = shuffle(countryCodes.filter(code => code !== answerCode)).slice(0, 3);

                return {
                    answerCode,
                    optionCodes: shuffle([answerCode, ...distractors]),
                };
            });

            this.$patch({
                ...defaultState(),
                phase: 'playing',
                difficulty,
                questions,
            });
            this.persist();
            return true;
        },

        submitAnswer(code) {
            if (this.phase !== 'playing'
                || this.selectedAnswer !== null
                || !this.currentQuestionData?.optionCodes.includes(code)) {
                return false;
            }

            this.selectedAnswer = code;
            if (code === this.currentQuestionData.answerCode) this.score++;
            this.persist();
            return true;
        },

        advanceQuestion() {
            if (this.phase !== 'playing' || this.selectedAnswer === null) return false;

            if (this.currentQuestion === this.totalQuestions) {
                this.phase = 'completed';
            } else {
                this.currentQuestion++;
            }

            this.selectedAnswer = null;
            this.persist();
            return true;
        },

        resetGame() {
            this.$patch(defaultState());
            this.clearPersisted();
        },

        hydrate() {
            const saved = sessionStorage.getItem(STORAGE_KEY);
            if (!saved) return;

            try {
                const parsed = {
                    ...defaultState(),
                    ...JSON.parse(saved),
                    loading: false,
                    totalQuestions: TOTAL_QUESTIONS,
                };

                if (!isValidState(parsed)) throw new Error('Invalid saved game');
                this.$patch(parsed);
            } catch (error) {
                this.$patch(defaultState());
                this.clearPersisted();
            }
        },

        persist() {
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify({
                phase: this.phase,
                difficulty: this.difficulty,
                score: this.score,
                currentQuestion: this.currentQuestion,
                totalQuestions: this.totalQuestions,
                questions: this.questions,
                selectedAnswer: this.selectedAnswer,
            }));
        },

        clearPersisted() {
            sessionStorage.removeItem(STORAGE_KEY);
        },
    },
});
