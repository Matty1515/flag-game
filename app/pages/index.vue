<script setup>
const games = [
    { title: 'Flag Guessing Game', to: '/games/flags' },
];
</script>

<template>
    <main>
        <h1>Flag Game</h1>
        <p>Pick a game mode.</p>
        <ul>
            <li v-for="game in games" :key="game.to">
                <NuxtLink :to="game.to">{{ game.title }}</NuxtLink>
            </li>
        </ul>
    </main>
</template>
