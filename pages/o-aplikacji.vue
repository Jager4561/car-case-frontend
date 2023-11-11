<script setup lang="ts">
import {
  InformationCircleIcon,
  XMarkIcon,
  IdentificationIcon
} from '@heroicons/vue/24/solid';
import { IconVersions, IconUser } from '@tabler/icons-vue';

useSeoMeta({
  title: 'O aplikacji',
});

const runtimeConfig = useRuntimeConfig();
const mobileView = ref<'content' | 'details' | 'info'>('content');
const isDesktop = ref(false);
const detailsRef = ref<HTMLDivElement | null>(null);
const infoRef = ref<HTMLDivElement | null>(null);
const footerRef = ref<HTMLDivElement | null>(null);

const openAccountDetails = () => {
  mobileView.value = 'details';
};

const closeAccountDetails = () => {
  mobileView.value = 'content';
};

const openInfo = () => {
  mobileView.value = 'info';
};

const closeInfo = () => {
  mobileView.value = 'content';
};

const onResize = () => {
  isDesktop.value = window.innerWidth >= 1024;
};

const clickedOutsideDetails = (event: MouseEvent) => {
  if (window.innerWidth >= 1024) return;
  const isOpen = mobileView.value === 'details';
  const isTarget = detailsRef.value === event.target;
  const clickedInside = detailsRef.value?.contains(event.target as Node);
  const isFooter = footerRef.value === event.target;
  const clickedFooter = footerRef.value?.contains(event.target as Node);

  if (isOpen && !isTarget && !clickedInside && !isFooter && !clickedFooter) {
    closeAccountDetails();
  }
};

const clickedOutsideInfo = (event: MouseEvent) => {
  if (window.innerWidth >= 1024) return;
  const isOpen = mobileView.value === 'info';
  const isTarget = infoRef.value === event.target;
  const clickedInside = infoRef.value?.contains(event.target as Node);
  const isFooter = footerRef.value === event.target;
  const clickedFooter = footerRef.value?.contains(event.target as Node);

  if (isOpen && !isTarget && !clickedInside && !isFooter && !clickedFooter) {
    closeInfo();
  }
};

onMounted(() => {
  window.addEventListener('resize', onResize);
  window.addEventListener('click', clickedOutsideDetails);
  window.addEventListener('click', clickedOutsideInfo);
  onResize();
});
</script>

<template>
  <div class="page_container">
    <Transition name="drawer-left">
      <div v-show="mobileView === 'details' || isDesktop" class="page_container__details">
        <div ref="detailsRef" class="page_container__details__wrapper drawer__wrapper">
          <div class="app-info">
            <div class="app-info__container">
              <h5 class="app-info__title">Szczegóły</h5>
              <div class="single-info">
                <div class="label">
                  <IconVersions class="icon" />
                  <span>Wersja aplikacji</span>
                </div>
                <div class="value">
                  {{ runtimeConfig.public.appVersion }}
                </div>
              </div>
              <div class="single-info">
                <div class="label">
                  <IconUser class="icon" />
                  <span>Autor</span>
                </div>
                <div class="value">
                  Wojciech Cyrwus
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
    <article class="content">
      <div class="content__container">
        <div class="logo">
          Car<span class="highlight">Case</span>
        </div>
        <div class="description">
          Carcase to projekt stworzony na potrzeby pracy inżynierskiej na Instytucie Nauk Technicznych Uniwersytetu Komisji Edukacji Narodowej w Krakowie. 
          Aplikacja została stworzona w celu ułatwienia użytkownikom aplikacji wymianą doświadczeń oraz rad w serwisowaniu pojazdów samochodowych. 
          Wyszukiwarka instrukcji napraw pozwala na filtrowanie wyników według wielu kryteriów. 
          Aplikacja pozwala również na dodawanie komentarzy do instrukcji w celu ułatwienia dyskusji, a także na zgłaszanie komentarzy naruszających regulamin serwisu.
          <br><br>
          Promotor: dr Grzegorz Jagło<br>
          Jednostka: Instytut Nauk Technicznych<br>
          Uniwersytet Komisji Edukacji Narodowej w Krakowie
        </div>
      </div>
    </article>
    <Transition name="drawer-right">
      <aside v-show="mobileView === 'info' || isDesktop" class="right_bar">
        <div ref="infoRef" class="right_bar__wrapper drawer__wrapper">
          <RightSideBar />
        </div>
      </aside>
    </Transition>
    <div ref="footerRef" class="footer">
      <div class="start">
        <Transition name="swipe-right" mode="out-in">
          <button v-if="mobileView === 'content'" class="text-button text-button__large text-button__secondary" @click="openAccountDetails()">
            <IdentificationIcon class="button-icon" />
            <span>Szczegóły</span>
          </button>
          <button v-else-if="mobileView === 'details'" class="text-button text-button__large text-button__secondary" @click="closeAccountDetails()">
            <XMarkIcon class="button-icon" />
            <span>Zamknij</span>
          </button>
        </Transition>
      </div>
      <div class="end">
        <Transition name="swipe-left" mode="out-in">
          <button v-if="mobileView === 'content'" class="text-button text-button__large text-button__secondary" @click="openInfo()">
            <InformationCircleIcon class="button-icon" />
            <span>Info</span>
          </button>
          <button v-else-if="mobileView === 'info'" class="text-button text-button__large text-button__secondary" @click="closeInfo()">
            <XMarkIcon class="button-icon" />
            <span>Zamknij</span>
          </button>
        </Transition>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.page_container {
  @apply w-full h-auto flex items-start pb-[72px];
  @apply lg:pb-0;

  &__details {
    @apply fixed bottom-[72px] left-0 bg-zinc-900 bg-opacity-50 w-full h-full z-20;
    height: calc(100vh - theme('spacing.20') - 72px);
    @apply lg:sticky lg:top-20 lg:left-0 lg:border-r lg:border-r-zinc-700 lg:max-w-xs;

    @screen lg {
      height: calc(100vh - theme('spacing.20'));
    }

    &__wrapper {
      @apply w-full h-full flex justify-start bg-zinc-900;
      @apply sm:max-w-sm;
      @apply lg:max-w-full;
    }

    .app-info {
      @apply w-full h-full flex flex-col justify-between relative;

      &__container {
        @apply flex-grow w-full h-auto p-4 overflow-auto;
        @apply lg:p-6;
      }

      &__title {
        @apply mb-4;
      }

      .single-info {
        @apply w-full h-auto rounded-lg border border-zinc-600 p-3 mb-3;

        .label {
          @apply w-full h-auto flex items-center space-x-2 text-neutral-400 mb-2;

          .icon {
            @apply w-4 h-4;
          }

          span {
            @apply text-sm font-extralight;
            @apply md:text-xs;
          }
        }

        .value {
          @apply text-lg font-light;
          @apply md:text-sm;
        }

        .value-disabled {
          @apply text-neutral-400;
        }
      }
    }
  }

  .content {
    @apply w-full h-auto p-4 mb-8;
    @apply lg:p-6 lg:py-8;

    &__container {
      @apply w-full h-auto max-w-screen-lg mx-auto;

      .logo {
        @apply text-4xl font-black leading-6 uppercase mb-6;

        .highlight {
          @apply text-darkCyan;
        }
      }
    }
  }

  .right_bar {
    @apply fixed bottom-[72px] right-0 bg-zinc-900 bg-opacity-50 w-full h-full flex justify-end;
    height: calc(100vh - theme('spacing.20') - 72px);
    @apply lg:sticky lg:top-20 lg:bottom-auto lg:bg-transparent lg:max-w-xs;
    @screen lg {
      height: calc(100vh - theme('spacing.20'));
    }

    &__wrapper {
      @apply w-full h-full flex justify-end bg-zinc-800;
      @apply sm:max-w-sm;
      @apply lg:max-w-full;
    }
  }

  .footer {
    @apply fixed bottom-0 left-0 w-full h-[72px] bg-zinc-900 flex items-center justify-between border-t border-t-zinc-700 px-4 py-3 z-40;
    @apply lg:hidden;
  }
}
</style>
