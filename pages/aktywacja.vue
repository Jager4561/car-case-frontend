<script setup lang="ts">
    import { useVuelidate } from '@vuelidate/core'
    import { required, email } from '@vuelidate/validators'
    import { helpers } from '@vuelidate/validators'

    definePageMeta({
        layout: 'auth',
    });

    const isFormPending = ref(false);
    const stage = ref('error');
</script>

<template>
    <div class="login_container">
        <NuxtLink to="/" class="logo">
            <h3><span class="highlight">CAR</span>CASE</h3>
        </NuxtLink>
        <Transition name="fade" mode="out-in">
            <div v-if="stage === 'activated'">
                <h1 class="page_title">Konto zostało aktywowane</h1>
                <p class="description">
                    Konto pomyślnie aktytowane. Możesz się teraz zalogować.
                </p>
            </div>
            <div v-else-if="stage === 'already_activated'">
                <h1 class="page_title">Konto już jest aktywne</h1>
                <p class="description">
                    Konto już zostało przez Ciebie aktywowane. Możesz się zalogować.
                </p>
            </div>
            <div v-else-if="stage === 'error'" class="error">
                <h1 class="page_title">Wystąpił błąd</h1>
                <p class="description">
                    Nie możemy aktywować Twojego konta. Sprawdź link aktywacyjny i spróbuj ponownie.
                </p>
            </div>
        </Transition>
        <div class="spacer"></div>
        <NuxtLink to="/zaloguj" class="secondary_button">
            <span>Zaloguj się</span>
        </NuxtLink>
    </div>
</template>

<style scoped lang="scss">
    .login_container {
        @apply w-full h-full flex flex-col items-start justify-center p-12 relative;
        @apply sm:p-16;

        .loading_mask {
            @apply absolute top-0 left-0 flex items-center justify-center w-full h-full bg-zinc-900 opacity-75 z-10;
        }

        .logo {
            @apply w-auto h-auto mb-4;

            h3 {
                @apply text-xl font-black leading-5;

                .highlight {
                    @apply text-darkCyan;
                }
            }
        }

        .page_title {
            @apply w-full h-auto text-2xl font-normal leading-5 mb-4;
        }

        .description {
            @apply text-sm font-light mb-4;
        }

        .error {
            .page_title {
                @apply text-red-600;
            }
        }

        .spacer {
            @apply w-1/2 h-0.5 bg-zinc-700 rounded-md mx-auto mb-6;
        }

        .secondary_button {
            @apply w-full h-10 flex items-center justify-center text-white bg-zinc-700 rounded-md px-6 py-2 text-sm font-semibold duration-150 cursor-pointer mb-2;
            @apply hover:bg-zinc-600;
        }

        .secondary_button:last-child {
            @apply mb-0;
        }
    }
</style>