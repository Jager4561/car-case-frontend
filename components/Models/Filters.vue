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
  },
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
};
</script>

<template>
  <div class="filters">
    <div class="filters__container">
      <h5 class="filters__title">Filtry</h5>
      <div class="filters__stats">
        <div class="results">Wyniki: <span>24</span></div>
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
            <input type="text" placeholder="Szukaj..." />
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
      <div class="filters__group">
        <div class="field">
          <label for="" class="field__label">Pojazd</label>
          <InputSelect v-model="filters.brand" placeholder="Marka pojazdu" :options="brands" />
        </div>
      </div>
      <div class="filters__single">
        <div class="field">
          <label for="" class="field__label">Rozpoczęcie produkcji</label>
          <InputDate v-model="filters.dateFrom" />
        </div>
      </div>
      <div class="filters__single">
        <div class="field">
          <label for="" class="field__label">Koniec produkcji</label>
          <InputDate v-model="filters.dateTo" />
        </div>
      </div>
      <div class="filters__single">
        <div class="radio-group">
          <div class="title">Paliwo</div>
          <div class="fields fuels-types">
            <div class="radio">
              <label for="pb95" class="radio-container">
                <input id="pb95" type="checkbox" checked />
                <span class="checkmark"></span>
              </label>
              <label for="pb95" class="fuel_label pb95">PB95</label>
            </div>
            <div class="radio">
              <label for="on" class="radio-container">
                <input id="on" type="checkbox" checked />
                <span class="checkmark"></span>
              </label>
              <label for="on" class="fuel_label on">ON</label>
            </div>
            <div class="radio">
              <label for="hybrid" class="radio-container">
                <input id="hybrid" type="checkbox" checked />
                <span class="checkmark"></span>
              </label>
              <label for="hybrid" class="fuel_label hybrid">Hybrid</label>
            </div>
            <div class="radio">
              <label for="lpg" class="radio-container">
                <input id="lpg" type="checkbox" checked />
                <span class="checkmark"></span>
              </label>
              <label for="lpg" class="fuel_label lpg">LPG</label>
            </div>
            <div class="radio">
              <label for="cng" class="radio-container">
                <input id="cng" type="checkbox" checked />
                <span class="checkmark"></span>
              </label>
              <label for="cng" class="fuel_label cng">CNG</label>
            </div>
            <div class="radio">
              <label for="hydrogen" class="radio-container">
                <input id="hydrogen" type="checkbox" checked />
                <span class="checkmark"></span>
              </label>
              <label for="hydrogen" class="fuel_label hydrogen">Hydrogen</label>
            </div>
            <div class="radio">
              <label for="ev" class="radio-container">
                <input id="ev" type="checkbox" checked />
                <span class="checkmark"></span>
              </label>
              <label for="ev" class="fuel_label ev">EV</label>
            </div>
          </div>
        </div>
      </div>
      <div class="filters__single">
        <div class="radio-group">
          <div class="title">Typ nadwozia</div>
          <div class="fields">
            <div class="radio">
              <label for="ev" class="radio-container">
                <input id="ev" type="checkbox" checked />
                <span class="checkmark"></span>
              </label>
              <label for="ev" class="option-label">Hatchback</label>
            </div>
            <div class="radio">
              <label for="ev" class="radio-container">
                <input id="ev" type="checkbox" checked />
                <span class="checkmark"></span>
              </label>
              <label for="ev" class="option-label">Sedan</label>
            </div>
            <div class="radio">
              <label for="ev" class="radio-container">
                <input id="ev" type="checkbox" checked />
                <span class="checkmark"></span>
              </label>
              <label for="ev" class="option-label">Kombi</label>
            </div>
            <div class="radio">
              <label for="ev" class="radio-container">
                <input id="ev" type="checkbox" checked />
                <span class="checkmark"></span>
              </label>
              <label for="ev" class="option-label">Cabrio</label>
            </div>
            <div class="radio">
              <label for="ev" class="radio-container">
                <input id="ev" type="checkbox" checked />
                <span class="checkmark"></span>
              </label>
              <label for="ev" class="option-label">Pick-up</label>
            </div>
            <div class="radio">
              <label for="ev" class="radio-container">
                <input id="ev" type="checkbox" checked />
                <span class="checkmark"></span>
              </label>
              <label for="ev" class="option-label">Coupe</label>
            </div>
            <div class="radio">
              <label for="ev" class="radio-container">
                <input id="ev" type="checkbox" checked />
                <span class="checkmark"></span>
              </label>
              <label for="ev" class="option-label">SUV</label>
            </div>
            <div class="radio">
              <label for="ev" class="radio-container">
                <input id="ev" type="checkbox" checked />
                <span class="checkmark"></span>
              </label>
              <label for="ev" class="option-label">Van</label>
            </div>
            <div class="radio">
              <label for="ev" class="radio-container">
                <input id="ev" type="checkbox" checked />
                <span class="checkmark"></span>
              </label>
              <label for="ev" class="option-label">Minivan</label>
            </div>
          </div>
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

    .fuels-types {
      @apply flex flex-row items-center justify-start flex-wrap;

      .radio {
        @apply mb-3 mr-4 mt-0;
      }
    }

    .fuel_label {
      @apply w-auto h-auto rounded-md text-xs uppercase font-semibold px-3 py-1.5 leading-3;

      &.pb95 {
        @apply text-white bg-green-700;
      }

      &.on {
        @apply text-white bg-black;
      }

      &.hybrid {
        @apply text-white bg-indigo-600;
      }

      &.lpg {
        @apply text-zinc-800 bg-white;
      }

      &.cng {
        @apply text-white bg-red-600;
      }

      &.hydrogen {
        @apply text-black bg-yellow-400;
      }

      &.ev {
        @apply text-white bg-blue-600;
      }
    }
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
