<script setup lang="ts">
import { FunnelIcon, InformationCircleIcon, TrashIcon, CheckIcon, XMarkIcon, ExclamationTriangleIcon, ArchiveBoxXMarkIcon } from '@heroicons/vue/24/solid';
import { Subject } from 'rxjs';
import { useModelsState } from '@/composables/store/vehicle-models/useModels';
import { ModelsFilterRules } from '@/composables/store/filters/filters.model';

const { models, errorOccured, fetchPending, fetchModels } = useModelsState();
const filters = ref<ModelsFilterRules>({
  search: null,
  sort: 'default',
  dateFrom: null,
  dateTo: null,
  brand: null,
  fuels: [],
  hullTypes: [],
});
const filteredModels = ref<ModelGeneration[]>([]);
const mobileView = ref<'posts' | 'filters' | 'info'>('posts');
const isDesktop = ref(false);
const filtersRef = ref<HTMLDivElement | null>(null);
const infoRef = ref<HTMLDivElement | null>(null);
const footerRef = ref<HTMLDivElement | null>(null);
const clearFiltersSubject = ref(new Subject<void>());
const pageStatus = ref<'loading' | 'error' | 'empty' | 'loaded'>('loading');

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

const loadModels = async () => {
  if(fetchPending.value) return;
  try {
    if(models.value == null) {
      await fetchModels();
    }
    if(models.value && models.value.length === 0) {
      pageStatus.value = 'empty';
    } else {
      pageStatus.value = 'loaded';
    }
  } catch (error) {
    pageStatus.value = 'error';
  }
}

const refreshPage = async () => {
  pageStatus.value = 'loading';
  loadModels();
}

const onFiltersChange = (updatedFilters: ModelsFilterRules) => {
  filters.value = updatedFilters;
  filterModels();
}

const filterModels = () => {
  filteredModels.value = [];
  let finalResult = models.value ? [...models.value] : [];
  if(filters.value.search != null && filters.value.search.length > 0) {
    const search = filters.value.search.replace(/\s/g, '').toLowerCase();
    finalResult = finalResult.filter((model) => {
      const fullName = `${model.brand.name}${model.model}${model.generation}`.replace(/\s/g, '').toLowerCase();
      return fullName.includes(search);
    });
  }
  if(filters.value.brand != null) {
    finalResult = finalResult.filter((model) => {
      return model.brand.id === filters.value.brand;
    });
  }
  if(filters.value.fuels) {
    finalResult = finalResult.filter((model) => {
      return model.engines.some((engine) => filters.value.fuels.includes(engine.fuel.id));
    });
  }
  if(filters.value.hullTypes) {
    finalResult = finalResult.filter((model) => {
      return model.hull_types.some((hullType) => filters.value.hullTypes.includes(hullType.id));
    });
  }
  if(filters.value.dateFrom != null) {
    finalResult = finalResult.filter((model) => {
      return model.production_start != null && new Date(model.production_start) >= filters.value.dateFrom!;
    });
  }
  if(filters.value.dateTo != null) {
    finalResult = finalResult.filter((model) => {
      return model.production_end != null && new Date(model.production_end) <= filters.value.dateTo!;
    });
  }
  switch(filters.value.sort) {
    case 'newest': {
      finalResult = finalResult.sort((a, b) => {
        if(a.date_created == null || b.date_created == null) return 0;
        return new Date(b.date_created).getTime() - new Date(a.date_created).getTime();
      });
      break;
    }
    case 'oldest': {
      finalResult = finalResult.sort((a, b) => {
        if(a.date_created == null || b.date_created == null) return 0;
        return new Date(a.date_created).getTime() - new Date(b.date_created).getTime();
      });
      break;
    }
    case 'mostPopular': {
      finalResult = finalResult.sort((a, b) => {
        if(a.posts_count == null || b.posts_count == null) return 0;
        return b.posts_count - a.posts_count;
      });
      break;
    }
    case 'leastPopular': {
      finalResult = finalResult.sort((a, b) => {
        if(a.posts_count == null || b.posts_count == null) return 0;
        return a.posts_count - b.posts_count;
      });
      break;
    }
    case 'nameAsc': {
      finalResult = finalResult.sort((a, b) => {
        const afullName = `${a.brand.name} ${a.model} ${a.generation}`;
        const bfullName = `${b.brand.name} ${b.model} ${b.generation}`;
        return afullName.localeCompare(bfullName);
      });
      break;
    }
    case 'nameDesc': {
      finalResult = finalResult.sort((a, b) => {
        const afullName = `${a.brand.name} ${a.model} ${a.generation}`;
        const bfullName = `${b.brand.name} ${b.model} ${b.generation}`;
        return bfullName.localeCompare(afullName);
      });
      break;
    }
    default: {
      break;
    }
  }
  setTimeout(() => {
    filteredModels.value = finalResult;
    if(filteredModels.value.length === 0) {
      pageStatus.value = 'empty';
    } else {
      pageStatus.value = 'loaded';
    }
  }, 100);
}

onMounted(() => {
  window.addEventListener('resize', onResize);
  window.addEventListener('click', clickedOutsideFilters);
  window.addEventListener('click', clickedOutsideInfo);
  onResize();
  loadModels();
});

watch(models, () => {
  loadModels();
});

watch(errorOccured, () => {
  if(errorOccured.value) {
    pageStatus.value = 'error';
  }
});
</script>

<template>
  <div class="page_container">
    <Transition name="drawer-left">
      <div v-show="mobileView === 'filters' || isDesktop" class="page_container__filters">
        <div ref="filtersRef" class="page_container__filters__wrapper drawer__wrapper">
          <ModelsFilters :resultCount="filteredModels.length" :invokeClearFilters="clearFiltersSubject" @onFiltersUpdate="onFiltersChange" />
        </div>
      </div>
    </Transition>
    <article class="page-content">
      <Transition name="fade" mode="out-in">
        <ModelsLoader v-if="pageStatus === 'loading'" />
        <div v-else-if="pageStatus === 'loaded'" class="models-list">
          <ModelsCard v-for="model in filteredModels" :model="model" />
        </div>
        <div v-else-if="pageStatus === 'empty'" class="page-empty">
          <div class="page-empty__container">
            <div class="page-empty__header">
              <ArchiveBoxXMarkIcon class="icon" />
              <span>Brak elementów</span>
            </div>
            <div class="page-empty__description">
              Nie dodano żadnych modeli pojazdów lub obecne modele nie spełniają kryteriów wyszukiwania nałożonych w filtrach.
            </div>
            <div class="page-empty__actions">
              <button class="text-button text-button__medium text-button__primary" @click="clearFilters()">
                <span>Wyczyść filtry</span>
              </button>
              <button class="text-button text-button__medium text-button__secondary" @click="refreshPage()">
                <span>Odśwież</span>
              </button>
            </div>
          </div>
        </div>
        <div v-else class="page-error">
          <div class="page-error__container">
            <div class="page-error__header">
              <ExclamationTriangleIcon class="icon" />
              <span>Błąd ładowania</span>
            </div>
            <div class="page-error__description">
              Wystąpił błąd podczas ładowania modeli pojazdów na tej stronie. Odśwież stronę lub spróbuj ponownie później.
            </div>
            <div class="page-error__actions">
              <button class="text-button text-button__medium text-button__primary" @click="refreshPage()">
                <span>Odśwież</span>
              </button>
              <NuxtLink to="/" class="text-button text-button__medium text-button__secondary">
                <span>Strona główna</span>
              </NuxtLink>
            </div>
          </div>
        </div>
      </Transition>
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
  @apply w-full flex items-start pb-[72px];
  height: calc(100vh - 5rem);
  @apply lg:pb-0 lg:h-auto;

  &__filters {
    @apply fixed bottom-[72px] left-0 bg-zinc-900 bg-opacity-50 w-full h-full z-10;
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

  .page-content {
    @apply w-full h-auto;

    .models-list {
      @apply w-full h-auto grid grid-cols-1 gap-3 p-4 pb-24;
      @apply sm:grid-cols-2;
      @apply md:grid-cols-3;
      @apply lg:grid-cols-2 lg:p-6;
      @apply xl:grid-cols-3;
      @apply 3xl:grid-cols-4;
    }
    
    .page-empty {
      @apply w-full h-auto min-h-full p-4 flex items-center justify-center;
      @apply lg:p-6;
      height: calc(100vh - 5rem - 72px);

      @screen lg {
        height: calc(100vh - 5rem);
      }

      &__container {
        @apply w-auto max-w-md h-auto rounded-lg bg-zinc-900 p-6;
      }

      &__header {
        @apply w-auto h-auto flex items-center space-x-2 text-zinc-400 mb-4;

        .icon {
          @apply w-8 h-8;
        }

        span {
          @apply text-lg font-bold;
        }
      }

      &__description {
        @apply font-light text-sm mb-6;
      }

      &__actions {
        @apply w-full h-auto flex items-center justify-end space-x-2;
      }
    }

    .page-error {
      @apply w-full p-4 flex items-center justify-center;
      @apply lg:p-6;
      height: calc(100vh - 5rem - 72px);

      @screen lg {
        height: calc(100vh - 5rem);
      }

      &__container {
        @apply w-auto max-w-md h-auto rounded-lg bg-zinc-900 p-6;
      }

      &__header {
        @apply w-auto h-auto flex items-center space-x-2 text-red-600 mb-4;

        .icon {
          @apply w-8 h-8;
        }

        span {
          @apply text-lg font-bold;
        }
      }

      &__description {
        @apply font-light text-sm mb-6;
      }

      &__actions {
        @apply w-full h-auto flex items-center justify-end space-x-2;
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
