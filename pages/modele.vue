<script setup lang="ts">
import { FunnelIcon, InformationCircleIcon, TrashIcon, CheckIcon, XMarkIcon } from '@heroicons/vue/24/solid';
import { Subject } from 'rxjs';

const models = ref([
  {
    brand: {
      logo: 'vw_logo.png',
      name: 'Volkswagen',
      slug: 'volkswagen',
    },
    model: 'Golf IV',
    modelSlug: 'golf',
    generation: '4',
    image: 'golf.jpg',
    productionStart: '1997',
    productionEnd: '2003',
    fuels: ['pb95', 'on', 'lpg'],
    hullTypes: ['hatchback', 'sedan', 'kombi', 'cabrio'],
  },
  {
    brand: {
      logo: 'seat_logo.png',
      name: 'Seat',
      slug: 'seat',
    },
    model: 'Ibiza III',
    modelSlug: 'ibiza',
    generation: '3',
    image: 'seat.jpg',
    productionStart: '2002',
    productionEnd: '2008',
    fuels: ['pb95', 'on', 'lpg'],
    hullTypes: ['hatchback', 'sedan'],
  },
  {
    brand: {
      logo: 'skoda_logo.png',
      name: 'Skoda',
      slug: 'skoda',
    },
    model: 'Fabia I',
    modelSlug: 'fabia',
    generation: '1',
    image: 'fabia.jpg',
    productionStart: '1999',
    productionEnd: '2008',
    fuels: ['pb95', 'on', 'lpg'],
    hullTypes: ['hatchback', 'sedan', 'kombi'],
  },
]);

const mobileView = ref<'posts' | 'filters' | 'info'>('posts');
const isDesktop = ref(false);
const filtersRef = ref<HTMLDivElement | null>(null);
const infoRef = ref<HTMLDivElement | null>(null);
const footerRef = ref<HTMLDivElement | null>(null);
const clearFiltersSubject = ref(new Subject<void>());

const openFilters = () => {
  mobileView.value = 'filters';
};

const clearFilters = () => {
  clearFiltersSubject.value.next();
};

const closeFilters = () => {
  mobileView.value = 'posts';
};

const openInfo = () => {
  mobileView.value = 'info';
};

const closeInfo = () => {
  mobileView.value = 'posts';
};

const onResize = () => {
  isDesktop.value = window.innerWidth >= 1024;
};

const clickedOutsideFilters = (event: MouseEvent) => {
  if (window.innerWidth >= 1024) return;
  const isOpen = mobileView.value === 'filters';
  const isTarget = filtersRef.value === event.target;
  const clickedInside = filtersRef.value?.contains(event.target as Node);
  const isFooter = footerRef.value === event.target;
  const clickedFooter = footerRef.value?.contains(event.target as Node);

  if (isOpen && !isTarget && !clickedInside && !isFooter && !clickedFooter) {
    closeFilters();
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
  window.addEventListener('click', clickedOutsideFilters);
  window.addEventListener('click', clickedOutsideInfo);
  onResize();
});
</script>

<template>
  <div class="page_container">
    <Transition name="drawer-left">
      <div v-show="mobileView === 'filters' || isDesktop" class="page_container__filters">
        <div ref="filtersRef" class="page_container__filters__wrapper drawer__wrapper">
          <ModelsFilters />
        </div>
      </div>
    </Transition>
    <article class="models_grid">
      <ModelCard v-for="model in models" :model="model" />
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
          <button v-if="mobileView === 'posts'" class="text-button text-button__large text-button__secondary" @click="openFilters()">
            <FunnelIcon class="button-icon" />
            <span>Filtry</span>
          </button>
          <button v-else-if="mobileView === 'filters'" class="text-button text-button__large text-button__secondary" @click="clearFilters()">
            <TrashIcon class="button-icon" />
            <span>Wyczyść filtry</span>
          </button>
        </Transition>
      </div>
      <div class="end">
        <Transition name="swipe-left" mode="out-in">
          <button v-if="mobileView === 'filters'" class="text-button text-button__large text-button__primary" @click="closeFilters()">
            <CheckIcon class="button-icon" />
            <span>Zatwierdź</span>
          </button>
          <button v-else-if="mobileView === 'posts'" class="text-button text-button__large text-button__secondary" @click="openInfo()">
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

  &__filters {
    @apply fixed bottom-[72px] left-0 bg-zinc-900 bg-opacity-50 w-full h-full;
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
  }

  .models_grid {
    @apply w-full h-auto grid grid-cols-1 gap-3 p-4;
    @apply sm:grid-cols-2;
    @apply md:grid-cols-3;
    @apply lg:grid-cols-2 lg:p-6;
    @apply xl:grid-cols-3;
    @apply 3xl:grid-cols-4;
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
