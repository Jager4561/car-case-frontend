<script setup lang="ts">
import dayjs from 'dayjs';
import 'dayjs/locale/pl';
import updateLocale from 'dayjs/plugin/updateLocale';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(updateLocale);
dayjs.extend(relativeTime);

dayjs.locale('pl');

const { isLoggedIn, initSessionState, deleteSession } = useAuthState();
const { performRequest } = useRequests();
const appState = ref('loading');

useSeoMeta({
  title: 'Ładowanie...',
});

onMounted(async () => {
  initSessionState();
  if (isLoggedIn.value) {
    try {
      await performRequest('GET', '/auth/ping');
      appState.value = 'loaded';
    } catch (error) {
      deleteSession();
      appState.value = 'loaded';
    }
  } else {
    appState.value = 'loaded';
  }
});
</script>

<template>
  <main class="app">
    <Transition name="fade" mode="out-in">
      <div  v-if="appState === 'loading'" class="loading">
        <h1>Car<span class="highlight">Case</span></h1>
        <div class="description">Ładowanie aplikacji</div>
        <div class="loader">
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
      <div v-else>
        <NuxtLayout>
          <SeoKit />
          <NuxtPage />
          <OgImageStatic />
          <Toasts />
        </NuxtLayout>
      </div>
    </Transition>
  </main>
</template>

<style scoped lang="scss">
.app {
  @apply w-full h-auto min-h-screen;

  .loading {
    @apply w-full h-screen flex flex-col items-center justify-center bg-zinc-900;

    h1 {
      @apply text-4xl font-black leading-5 uppercase mb-4;

      .highlight {
        @apply text-darkCyan;
      }
    }

    .description {
      @apply text-zinc-400 text-sm font-light mb-4;
    }

    .loader {
      @apply w-auto h-auto inline-flex items-center justify-center space-x-1.5 ml-2;

      div {
        @apply w-2 h-2 rounded-full bg-white;
        animation: fade 0.8s ease-in-out alternate infinite;
      }

      div:nth-of-type(1) {
        animation-delay: -0.4s;
      }

      div:nth-of-type(2) {
        animation-delay: -0.2s;
      }
    }
  }
}
</style>
