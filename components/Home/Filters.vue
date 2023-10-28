<script setup lang="ts">
import { MagnifyingGlassIcon, ArrowUturnLeftIcon, ExclamationTriangleIcon } from '@heroicons/vue/24/outline';
import { Observable } from 'rxjs';

const props = withDefaults(
  defineProps<{
    filters?: PostsFilterRules;
    resultCount: number;
    invokeClearFilters: Observable<void>;
  }>(),
  {
    resultCount: 0,
  }
);
const emit = defineEmits(['onFiltersUpdate']);
const filtersStatus = ref<'loading' | 'error' | 'success'>('loading');
const { filtersData, fetchPending, fetchFiltersData } = useFilters();

const filters = reactive<PostsFilterRules>({
  search: null,
  sort: 'latest',
  dateFrom: null,
  dateTo: null,
  brand: null,
  model: null,
  generation: null,
  author: null,
});

const sorting = ref([
  {
    value: 'latest',
    label: 'Najnowsze',
  },
  {
    value: 'oldest',
    label: 'Najstarsze',
  },
  {
    value: 'mostPopular',
    label: 'Najpopularniejsze',
  },
  {
    value: 'leastPopular',
    label: 'Najmniej popularne',
  },
  {
    value: 'name_asc',
    label: 'Alfabetycznie (rosnąco)',
  },
  {
    value: 'name_desc',
    label: 'Alfabetycznie (malejąco)',
  },
]);

const brands = ref<
  {
    value: string | number;
    label: string;
  }[]
>([
  {
    value: 0,
    label: 'Wszystkie',
  },
]);
const models = ref<
  {
    value: string | number;
    label: string;
  }[]
>([
  {
    value: 0,
    label: 'Wszystkie',
  },
]);
const generations = ref<
  {
    value: string | number;
    label: string;
  }[]
>([
  {
    value: 0,
    label: 'Wszystkie',
  },
]);

const accounts = ref<AuthorFilter[]>([]);

const onFiltersChange = () => {
  if(filtersData.value != null) {
    if(filters.brand != null && filters.brand != 0) {
      const wantedBrand = filtersData.value.brands.find((brand) => brand.id === filters.brand);
      if(wantedBrand) {
        models.value = wantedBrand.models.map((model) => ({
          value: model.id,
          label: model.name,
        }));
      }
    }
    if(filters.model != null && filters.model != 0) {
      const wantedModel = filtersData.value.brands.find((brand) => brand.id === filters.brand)?.models.find((model) => model.id === filters.model);
      if(wantedModel) {
        generations.value = wantedModel.generations.map((generation) => ({
          value: generation.id,
          label: generation.name,
        }));
      }
    }
  };
  emit('onFiltersUpdate', filters);
};

const clearFilters = () => {
  filters.search = null;
  filters.sort = 'latest';
  filters.dateFrom = null;
  filters.dateTo = null;
  filters.brand = null;
  filters.model = null;
  filters.generation = null;
  filters.author = null;
  onFiltersChange();
};

const setUpFilters = () => {
  if (filtersData.value == null) return;
  brands.value = filtersData.value.brands.map((brand) => ({
    value: brand.id,
    label: brand.name,
  }));
  accounts.value = filtersData.value.authors;

  if(props.filters == null) return;
  if(props.filters.search) {
    filters.search = props.filters.search;
  }
  if(props.filters.sort) {
    filters.sort = props.filters.sort;
  }
  if(props.filters.dateFrom) {
    filters.dateFrom = props.filters.dateFrom;
  }
  if(props.filters.dateTo) {
    filters.dateTo = props.filters.dateTo;
  }
  if(props.filters.author) {
    filters.author = props.filters.author;
  }
  if(props.filters.generation) {
    let wantedBrand = null;
    let wantedModel = null;
    let wantedGeneration = null;
    for(let i = 0; i < filtersData.value.brands.length; i++) {
      const brand = filtersData.value.brands[i];
      for(let j = 0; j < brand.models.length; j++) {
        const model = brand.models[j];
        for(let k = 0; k < model.generations.length; k++) {
          const generation = model.generations[k];
          if(generation.id === props.filters.generation) {
            wantedBrand = brand;
            wantedModel = model;
            wantedGeneration = generation;
            break;
          }
        }
        if(wantedGeneration != null) {
          break;
        }
      }
      if(wantedGeneration != null) {
        break;
      }
    }
    if(wantedBrand == null || wantedModel == null || wantedGeneration == null) {
      return;
    }
    filters.brand = wantedBrand.id;
    filters.model = wantedModel.id;
    filters.generation = wantedGeneration.id;
    return;
  }
  if(props.filters.model) {
    let wantedBrand = null;
    let wantedModel = null;
    for(let i = 0; i < filtersData.value.brands.length; i++) {
      const brand = filtersData.value.brands[i];
      for(let j = 0; j < brand.models.length; j++) {
        const model = brand.models[j];
        if(model.id === props.filters.model) {
          wantedBrand = brand;
          wantedModel = model;
          break;
        }
      }
      if(wantedModel != null) {
        break;
      }
    }
    if(wantedBrand == null || wantedModel == null) {
      return;
    }
    filters.brand = wantedBrand.id;
    filters.model = wantedModel.id;
    return;
  }
  if(props.filters.brand) {
    filters.brand = props.filters.brand;
  }
  if(props.filters.generation) {
    filters.generation = props.filters.generation;
  }
};

const loadFilters = async () => {
  if (fetchPending.value) return;
  filtersStatus.value = 'loading';
  try {
    if (filtersData.value == null) {
      await fetchFiltersData();
    }
    filtersStatus.value = 'success';
    setUpFilters();
  } catch (error) {
    filtersStatus.value = 'error';
  }
};

const refreshFilters = async () => {
  filtersStatus.value = 'loading';
  loadFilters();
}

onMounted(async () => {
  loadFilters();
  if (props.invokeClearFilters) {
    props.invokeClearFilters.subscribe(() => {
      clearFilters();
    });
  }
});

watch(filtersData, () => {
  loadFilters();
});

watch(filters, () => {
  onFiltersChange();
});

watch(props.filters, () => {
  setUpFilters();
});
</script>

<template>
  <div class="filters">
    <Transition name="fade" mode="out-in">
      <div v-if="filtersStatus === 'loading'" class="filters__loader">
        <div class="loader">
          <div></div>
          <div></div>
          <div></div>
        </div>
        <div class="note">Ładowanie filtrów</div>
      </div>
      <div v-else-if="filtersStatus === 'error'" class="filters__error">
        <ExclamationTriangleIcon class="icon" />
        <div class="title">Brak filtrów</div>
        <p class="description">Nie udało się załadować filtrów modeli.</p>
        <button class="text-button text-button__small text-button__secondary" @click="refreshFilters()">Spróbuj ponownie</button>
      </div>
      <div v-else-if="filtersStatus === 'success'" class="filters__container">
        <h5 class="filters__title">Filtry</h5>
        <div class="filters__stats">
          <div class="results">Wyniki: <span>{{ props.resultCount }}</span></div>
          <div class="actions">
            <button title="Wyczyść filtry" class="icon-button icon-button__secondary icon-button__small" @click="clearFilters()">
              <ArrowUturnLeftIcon />
            </button>
          </div>
        </div>
        <div class="filters__single">
          <div class="field">
            <label for="" class="field__label">Wyszukiwanie</label>
            <div class="field__input field__with-icon">
              <input v-model="filters.search" type="text" placeholder="Szukaj..." />
              <MagnifyingGlassIcon />
            </div>
          </div>
        </div>
        <div class="filters__single">
          <div class="field">
            <label for="" class="field__label">Sortowanie</label>
            <InputSelect v-model="filters.sort" placeholder="Typ" :clearVisible="false" :options="sorting" />
          </div>
        </div>
        <div class="filters__single">
          <div class="field">
            <label for="" class="field__label">Data opublikowanie (od)</label>
            <InputDate v-model="filters.dateFrom" />
          </div>
        </div>
        <div class="filters__single">
          <div class="field">
            <label for="" class="field__label">Data opublikowanie (do)</label>
            <InputDate v-model="filters.dateTo" />
          </div>
        </div>
        <div class="filters__group">
          <div class="field">
            <label for="" class="field__label">Pojazd</label>
            <InputSelect v-model="filters.brand" placeholder="Marka pojazdu" :options="brands" />
          </div>
          <div v-if="filters.brand != null && filters.brand != 0" class="field">
            <InputSelect v-model="filters.model" placeholder="Model pojazdu" :options="models" />
          </div>
          <div v-if="filters.model != null && filters.brand != 0" class="field">
            <InputSelect v-model="filters.generation" placeholder="Generacja pojazdu" :options="generations" />
          </div>
        </div>
        <div v-if="accounts && accounts.length > 0" class="filters__single">
          <div class="field">
            <label for="" class="field__label">Autor</label>
            <InputSearchAccount v-model="filters.author" :accounts="accounts" />
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
.filters {
  @apply w-full h-full flex flex-col justify-between relative;

  &__loader {
    @apply w-full h-full flex flex-col items-center justify-center space-y-2;

    .note {
      @apply text-xs text-zinc-300 font-extralight;
    }
  }

  &__error {
    @apply w-full h-full flex flex-col items-center justify-center;

    .icon {
      @apply absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-2/3 w-24 h-24 text-white opacity-10;
    }

    .title {
      @apply text-lg text-zinc-300 font-semibold mb-2;
    }

    .description {
      @apply w-1/2 text-center text-sm text-zinc-300 font-extralight mb-4;
    }
  }

  &__container {
    @apply flex-grow w-full h-auto p-4 overflow-auto;
    @apply lg:p-6;
  }

  &__title {
    @apply mb-4;
  }

  &__stats {
    @apply w-full h-auto flex items-center space-x-2 justify-between mb-4;

    .results {
      @apply w-auto h-auto px-2 py-1 rounded bg-zinc-700 text-xs text-zinc-300 font-light;

      span {
        @apply font-bold;
      }
    }

    .actions {
      @apply w-auto h-auto flex items-center space-x-2;
    }
  }

  &__single {
    @apply w-full h-auto mb-3;
  }

  &__group {
    @apply w-full h-auto mb-3;

    .field {
      @apply mb-2;
    }
  }

  &__actions {
    @apply flex-shrink-0 w-full h-auto space-y-2 p-6;

    button {
      @apply w-full;
    }
  }
}
</style>
