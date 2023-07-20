<script setup lang="ts">
    const models = ref([
        {
            brand: {
                logo: 'vw_logo.png',
                name: 'Volkswagen'
            },
            model: 'Golf IV',
            image: 'golf.jpg',
            productionStart: '1997',
            productionEnd: '2003',
            fuels: [
                'pb95',
                'on',
                'lpg'
            ],
            hullTypes: [
                'hatchback',
                'sedan',
                'kombi',
                'cabrio'
            ]
        },
        {
            brand: {
                logo: 'seat_logo.png',
                name: 'Seat'
            },
            model: 'Ibiza III',
            image: 'seat.jpg',
            productionStart: '2002',
            productionEnd: '2008',
            fuels: [
                'pb95',
                'on',
                'lpg'
            ],
            hullTypes: [
                'hatchback',
                'sedan',
            ]
        },
        {
            brand: {
                logo: 'skoda_logo.png',
                name: 'Skoda'
            },
            model: 'Fabia I',
            image: 'fabia.jpg',
            productionStart: '1999',
            productionEnd: '2008',
            fuels: [
                'pb95',
                'on',
                'lpg'
            ],
            hullTypes: [
                'hatchback',
                'sedan',
                'kombi'
            ]
        }
    ])
</script>

<template>
    <div class="models_grid">
        <ModelCard v-for="model in models" :model="model" />
    </div>
</template>

<style scoped lang="scss">
    .models_grid {
        @apply w-full h-auto grid grid-cols-3 gap-3 px-3 py-6;
    }
</style>