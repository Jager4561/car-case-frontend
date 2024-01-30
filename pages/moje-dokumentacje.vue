<script setup lang="ts">
import {
  FunnelIcon,
  InformationCircleIcon,
  TrashIcon,
  CheckIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
  ArchiveBoxXMarkIcon,
  ChevronDoubleRightIcon,
  ChevronDoubleLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/vue/24/solid';
import { Subject } from 'rxjs';
import { MyPostsFilterRules } from '@/composables/store/filters/filters.model';

definePageMeta({
  middleware: [
    'auth',
  ],
});

useSeoMeta({
  title: 'Moje dokumentacje',
});

const route = useRoute();
const router = useRouter();
const { account } = useAccount();
const { posts, postsMeta, fetchPosts } = usePostsState();
const filters = ref<MyPostsFilterRules>({
  search: null,
  sort: 'latest',
  dateFrom: null,
  dateTo: null,
  brand: null,
  model: null,
  generation: null,
});
const mobileView = ref<'posts' | 'filters' | 'info'>('posts');
const isDesktop = ref(false);
const filtersRef = ref<HTMLDivElement | null>(null);
const infoRef = ref<HTMLDivElement | null>(null);
const footerRef = ref<HTMLDivElement | null>(null);
const clearFiltersSubject = ref(new Subject<void>());
const pageStatus = ref<'loading' | 'error' | 'empty' | 'loaded'>('loading');

const currentPage = ref(0);
const totalPages = ref(0);

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

const onFiltersChange = (updatedFilters: ModelsFilterRules) => {
  filters.value = updatedFilters;
  currentPage.value = 0;
  updateSearchParams();
  loadPosts();
};

let paramsChangeByPage = ref(false);
const updateSearchParams = () => {
  const params = new URLSearchParams();

  if(filters.value.search) {
    params.set('search', filters.value.search);
  }
  if(filters.value.sort && filters.value.sort !== 'latest') {
    params.set('sort', filters.value.sort);
  }
  if(filters.value.dateFrom) {
    const day = filters.value.dateFrom.getDate().toString().padStart(2, '0');
    const month = (filters.value.dateFrom.getMonth() + 1).toString().padStart(2, '0');
    const year = filters.value.dateFrom.getFullYear().toString();
    params.set('dateFrom', `${year}-${month}-${day}`);
  }
  if(filters.value.dateTo) {
    const day = filters.value.dateTo.getDate().toString().padStart(2, '0');
    const month = (filters.value.dateTo.getMonth() + 1).toString().padStart(2, '0');
    const year = filters.value.dateTo.getFullYear().toString();
    params.set('dateTo', `${year}-${month}-${day}`);
  }
  if(filters.value.brand) {
    params.set('brand', filters.value.brand.toString());
  }
  if(filters.value.model) {
    params.set('model', filters.value.model.toString());
  }
  if(filters.value.generation) {
    params.set('generation', filters.value.generation.toString());
  }
  if(currentPage.value > 0) {
    params.set('page', currentPage.value.toString());
  } 
  paramsChangeByPage.value = true;
  if(params.size > 0) {
    router.replace('?' + params.toString());
  } else {
    router.replace('/moje-dokumentacje');
  }
}

const loadFiltersFromUrl = () => {
  if(paramsChangeByPage.value) {
    paramsChangeByPage.value = false;
    return;
  }
  
  filters.value = {
    search: null,
    sort: 'latest',
    dateFrom: null,
    dateTo: null,
    brand: null,
    model: null,
    generation: null,
  };
  currentPage.value = 0;

  if(route.query.search) {
    filters.value.search = route.query.search as string;
  }
  if(route.query.sort) {
    filters.value.sort = route.query.sort as string;
  }
  if(route.query.dateFrom) {
    filters.value.dateFrom = new Date(route.query.dateFrom as string);
  }
  if(route.query.dateTo) {
    filters.value.dateTo = new Date(route.query.dateTo as string);
  }
  if(route.query.brand) {
    filters.value.brand = parseInt(route.query.brand as string);
  }
  if(route.query.model) {
    filters.value.model = parseInt(route.query.model as string);
  }
  if(route.query.generation) {
    filters.value.generation = parseInt(route.query.generation as string);
  }
  if(route.query.page) {
    currentPage.value = parseInt(route.query.page as string);
  }
  loadPosts();
}

const loadPosts = async () => {
  pageStatus.value = 'loading';
  const filtersToSend: PostsFilterRules = {
    ...filters.value,
    author: account.value?.id,
    page: currentPage.value,
  };

  try {
    await fetchPosts(filtersToSend);
    if (postsMeta.value) {
      totalPages.value = Math.ceil(postsMeta.value.total / 20);
    }
    if (posts.value && posts.value.length === 0) {
      pageStatus.value = 'empty';
    } else {
      pageStatus.value = 'loaded';
    }
  } catch (error) {
    pageStatus.value = 'error';
  }
};

const nextPage = () => {
  if (currentPage.value + 1 < totalPages.value) {
    currentPage.value += 1;
    loadPosts();
  }
};

const prevPage = () => {
  if (currentPage.value - 1 >= 0) {
    currentPage.value -= 1;
    loadPosts();
  }
};

const goToFirstPage = () => {
  currentPage.value = 0;
  loadPosts();
};

const goToLastPage = () => {
  currentPage.value = totalPages.value - 1;
  loadPosts();
};

const clearAndRefreshPage = async () => {
  pageStatus.value = 'loading';
  clearFilters();
  currentPage.value = 0;
  loadPosts();
};

const refreshPageAfterError = async () => {
  pageStatus.value = 'loading';
  loadPosts();
};

onMounted(() => {
  window.addEventListener('resize', onResize);
  window.addEventListener('click', clickedOutsideFilters);
  window.addEventListener('click', clickedOutsideInfo);
  onResize();
});

watch(() => route.query, () => {
  paramsChangeByPage.value = false;
  loadFiltersFromUrl();
}, { immediate: true, deep: true });
</script>

<template>
  <div class="page_container">
    <Transition name="drawer-left">
      <div v-show="mobileView === 'filters' || isDesktop" class="page_container__filters">
        <div ref="filtersRef" class="page_container__filters__wrapper drawer__wrapper">
          <MyPostsFilters :filters="filters" :resultCount="postsMeta?.total" :invokeClearFilters="clearFiltersSubject" @onFiltersUpdate="onFiltersChange" />
        </div>
      </div>
    </Transition>
    <article class="content">
      <Transition name="fade" mode="out-in">
        <HomeLoader v-if="pageStatus === 'loading'"></HomeLoader>
        <div v-else-if="pageStatus === 'loaded'" class="post-list">
          <HomePost v-for="post in posts" :key="post.id" :post="post" />
          <div class="pagination">
            <button v-show="totalPages > 2 && currentPage >= 2" class="icon-button icon-button__secondary icon-button__small" title="Pierwsza strona" @click="goToFirstPage()">
              <ChevronDoubleLeftIcon class="icon" />
            </button>
            <button  v-show="currentPage >= 1" class="icon-button icon-button__secondary icon-button__small" title="Poprzednia strona" @click="prevPage()">
              <ChevronLeftIcon class="icon" />
            </button>
            <div class="current-page">
              {{ currentPage + 1 }} / {{ totalPages }}
            </div>
            <button v-show="currentPage + 1 < totalPages" class="icon-button icon-button__secondary icon-button__small" title="Następna strona" @click="nextPage()">
              <ChevronRightIcon class="icon" />
            </button>
            <button v-show="totalPages > 2 && currentPage < totalPages - 1" class="icon-button icon-button__secondary icon-button__small" title="Ostatnia strona" @click="goToLastPage()">
              <ChevronDoubleRightIcon class="icon" />
            </button>
          </div>
        </div>
        <div v-else-if="pageStatus === 'empty'" class="page-empty">
          <div class="page-empty__container">
            <div class="page-empty__header">
              <ArchiveBoxXMarkIcon class="icon" />
              <span>Brak elementów</span>
            </div>
            <div class="page-empty__description">Nie dodano żadnych instrukcji napraw lub obecne modele nie spełniają kryteriów wyszukiwania nałożonych w filtrach.</div>
            <div class="page-empty__actions">
              <button class="text-button text-button__medium text-button__primary" @click="clearFilters()">
                <span>Wyczyść filtry</span>
              </button>
              <button class="text-button text-button__medium text-button__secondary" @click="clearAndRefreshPage()">
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
            <div class="page-error__description">Wystąpił błąd podczas ładowania instrukcji napraw pojazdów na tej stronie. Odśwież stronę lub spróbuj ponownie później.</div>
            <div class="page-error__actions">
              <button class="text-button text-button__medium text-button__primary" @click="refreshPageAfterError()">
                <span>Odśwież</span>
              </button>
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
  @apply w-full h-auto flex items-start pb-[72px];
  @apply lg:pb-0;

  &__filters {
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
  }

  .content {
    @apply w-full h-auto p-4;
    @apply lg:p-6;

    .post-list {
      @apply w-full h-auto;

      .pagination {
        @apply w-auto h-auto flex items-center justify-center space-x-1 bg-zinc-900 rounded-lg p-2; 

        .current-page {
          @apply w-auto h-8 text-sm px-2 text-zinc-300 flex items-center;
        }
      }
    }

    .page-empty {
      @apply w-full h-auto min-h-full p-4 flex items-center justify-center;
      @apply lg:p-6;
      height: calc(100vh - 5rem - 72px);

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
