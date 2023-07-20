<script setup lang="ts">
    interface Model {
        brand: {
            logo: string;
            name: string;
        };
        model: string;
        image: string;
        productionStart: string;
        productionEnd: string;
        fuels: string[];
        hullTypes: string[];
    }

    const { model } = defineProps<{
        model: Model
    }>();
</script>

<template>
    <NuxtLink class="model_container">
        <div class="model_image">
            <NuxtImg :src="model.image" alt="Model"></NuxtImg>
        </div>
        <div class="model_info">
            <div class="model">
                <p>{{ model.model }} {{ model.productionStart != null && model.productionEnd != null ? `(${model.productionStart} - ${model.productionEnd})` : '' }}</p>
            </div>
            <div class="brand">
                <NuxtImg class="logo" :src="model.brand.logo" alt="Logo"></NuxtImg>
                <p>{{ model.brand.name }}</p>
            </div>
            <div class="fuels">
                <div v-for="fuel in model.fuels" class="fuel_mark" :class="fuel">{{ fuel }}</div>
            </div>
            <div class="hull_types">
                <div v-for="hullType in model.hullTypes" class="type">
                    <div class="dot"></div>
                    <p>{{ hullType }}</p>
                </div>
            </div>
        </div>
    </NuxtLink>
</template>

<style scoped lang="scss">
    .model_container {
        @apply w-full h-auto rounded-md bg-zinc-900 duration-150 overflow-hidden cursor-pointer;
        @apply hover:ring-1 hover:ring-darkCyan;

        .model_image {
            @apply w-full h-auto overflow-hidden;
            aspect-ratio: 3/2;

            img {
                @apply w-full h-full object-center object-cover duration-150;
            }
        }

        .model_info {
            @apply w-full h-auto p-3;

            .model {
                @apply w-full h-auto text-sm text-white mb-1; 
            }

            .brand {
                @apply w-full h-auto flex items-center space-x-2 mb-2;

                .logo {
                    @apply bg-zinc-500 w-5 h-5 p-px rounded;
                }

                p {
                    @apply text-zinc-300 text-sm;
                }
            }

            .fuels {
                @apply w-full h-auto flex items-center flex-wrap mb-1;

                .fuel_mark {
                    @apply w-auto h-auto rounded-md text-2xs uppercase font-semibold px-1.5 py-1 mr-1 mb-1 leading-3;
                }

                .pb95 {
                    @apply text-white bg-green-700;
                }

                .on {
                    @apply text-white bg-black;
                }

                .hybrid {
                    @apply text-white bg-indigo-600;
                }

                .lpg {
                    @apply text-zinc-800 bg-white;
                }

                .cng {
                    @apply text-white bg-red-600;
                }

                .hydrogen {
                    @apply text-white bg-yellow-400;
                }

                .ev {
                    @apply text-white bg-blue-600;
                }
            }

            .hull_types {
                @apply w-full h-auto flex items-center flex-wrap;

                .type {
                    @apply w-auto h-auto flex items-center space-x-1.5 mr-2 mb-1;

                    .dot {
                        @apply w-1 h-1 rounded-full bg-zinc-400;
                    }

                    p {
                        @apply text-zinc-400 text-xs capitalize;
                    }
                }
            }
        }
    }
</style>