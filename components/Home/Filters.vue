<script setup lang="ts">
  import { MagnifyingGlassIcon, ArrowUturnLeftIcon } from '@heroicons/vue/24/outline';

  const filters = reactive({
    search: null,
    sort: 'default',
    dateFrom: null,
    dateTo: null,
    brand: null,
    model: null,
    generation: null,
    account: null,
  });

  const sorting = ref([
    {
      value: 'default',
      label: 'Domyślne',
    },
    {
      value: 'newest',
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

  const brands = ref([
    {
      value: 'all',
      label: 'Wszystkie',
    },
    {
      value: 'audi',
      label: 'Audi',
    },
    {
      value: 'bmw',
      label: 'BMW',
    },
    {
      value: 'mercedes',
      label: 'Mercedes',
    }
  ]);
  const models = ref([
    {
      value: 'all',
      label: 'Wszystkie',
    },
    {
      value: 'a4',
      label: 'A4',
    },
    {
      value: 'a5',
      label: 'A5',
    },
    {
      value: 'a6',
      label: 'A6',
    }
  ]);

  const generations = ref([
    {
      value: 'all',
      label: 'Wszystkie',
    },
    {
      value: 'b8',
      label: 'B8',
    },
    {
      value: 'b9',
      label: 'B9',
    },
    {
      value: 'b10',
      label: 'B10',
    }
  ]);

  const clearFilters = () => {
    filters.search = null;
    filters.sort = 'default';
    filters.dateFrom = null;
    filters.dateTo = null;
    filters.brand = null;
    filters.model = null;
    filters.generation = null;
    filters.account = null;
  }
</script>

<template>
  <div class="filters">
    <div class="filters__container">
      <h5 class="filters__title">Filtry</h5>
      <div class="filters__stats">
        <div class="results">
          Wyniki: <span>24</span>
        </div>
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
            <input type="text" placeholder="Szukaj...">
            <MagnifyingGlassIcon />
          </div>
        </div>
      </div>
      <div class="filters__single">
        <div class="field">
          <label for="" class="field__label">Sortowanie</label>
          <InputSelect v-model="filters.sort" placeholder="Typ" :options="sorting" />
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
        <div v-if="filters.brand != null && filters.brand != 'all'" class="field">
          <InputSelect v-model="filters.model" placeholder="Model pojazdu" :options="models" />
        </div>
        <div v-if="filters.model != null && filters.brand != 'all'" class="field">
          <InputSelect v-model="filters.generation" placeholder="Generacja pojazdu" :options="generations" />
        </div>
      </div>
      <div class="filters__single">
      <div class="field">
        <label for="" class="field__label">Autor</label>
        <InputSearchAccount v-model="filters.account" />
      </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .filters {
    @apply w-full h-full flex flex-col justify-between relative;

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