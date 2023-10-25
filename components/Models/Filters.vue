<script setup lang="ts">
import { MagnifyingGlassIcon, ArrowUturnLeftIcon, ExclamationTriangleIcon } from '@heroicons/vue/24/outline';
import { useFilters } from '~/composables/store/filters/useFilters';
import lodash from 'lodash';
import { Observable } from 'rxjs';
import { ModelsFilterRules } from '@/composables/store/filters/filters.model';

const props = defineProps({
  resultCount: {
    type: Number,
    default: 0,
  },
  invokeClearFilters: {
    type: Observable,
  },
});
const emit = defineEmits(['onFiltersUpdate']);

const filtersStatus = ref<'loading' | 'error' | 'success'>('loading');
const { filtersData, fetchPending, fetchFiltersData } = useFilters();

const filters = reactive<ModelsFilterRules>({
  search: null,
  sort: 'mostPopular',
  dateFrom: null,
  dateTo: null,
  brand: null,
  fuels: [],
  hullTypes: [],
});

const sorting = ref([
  {
    value: 'mostPopular',
    label: 'Najpopularniejsze',
  },
  {
    value: 'leastPopular',
    label: 'Najmniej popularne',
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
    value: 'nameAsc',
    label: 'Alfabetycznie (rosnąco)',
  },
  {
    value: 'nameDesc',
    label: 'Alfabetycznie (malejąco)',
  },
]);

const brands = ref<{
  value: string | number;
  label: string;
}[]>([]);
const fuels = ref<{
  id: number;
  name: string;
  color: string;
}[]>([]);
const hullTypes = ref<{
  id: number;
  name: string;
}[]>([]);

const onFiltersChange = () => {
  emit('onFiltersUpdate', filters);
};

const onFuelChecked = (fuelId: number) => {
  if(filters.fuels.includes(fuelId)) {
    filters.fuels = filters.fuels.filter((fuel) => fuel !== fuelId);
  } else {
    filters.fuels.push(fuelId);
  }
};

const onHullTypeChecked = (hullTypeId: number) => {
  if(filters.hullTypes.includes(hullTypeId)) {
    filters.hullTypes = filters.hullTypes.filter((hullType) => hullType !== hullTypeId);
  } else {
    filters.hullTypes.push(hullTypeId);
  }
};

const clearFilters = () => {
  filters.search = null;
  filters.sort = 'mostPopular';
  filters.dateFrom = null;
  filters.dateTo = null;
  filters.brand = null;
  setUpFilters();
};

const setUpFilters = () => {
  if(filtersData.value == null) return;
  brands.value = filtersData.value.brands.map((brand) => ({
    value: brand.id,
    label: brand.name,
  }));
  fuels.value = filtersData.value.fuels.map((fuel) => ({
    id: fuel.id,
    slug: lodash.kebabCase(fuel.name),
    name: fuel.name,
    color: fuel.color,
  }));
  filters.fuels = filtersData.value.fuels.map((fuel) => fuel.id);
  hullTypes.value = filtersData.value.hull_types.map((hullType) => ({
    id: hullType.id,
    slug: lodash.kebabCase(hullType.name),
    name: hullType.name,
  }));
  filters.hullTypes = filtersData.value.hull_types.map((hullType) => hullType.id);
}

const loadFilters = async () => {
  if(fetchPending.value) return;
  filtersStatus.value = 'loading';
  try {
    if(filtersData.value == null) {
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
  if(props.invokeClearFilters) {
    props.invokeClearFilters.subscribe(() => {
      clearFilters();
    });
  }
});

watch(filters, () => {
  onFiltersChange();
});

watch(filtersData, () => {
  loadFilters();
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
        <button class="text-button text-button__small text-button__secondary" @click="refreshFilters()">
          Spróbuj ponownie
        </button>
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
              <input v-model="filters.search" name="search" type="text" placeholder="Szukaj..." />
              <MagnifyingGlassIcon />
            </div>
          </div>
        </div>
        <div class="filters__single">
          <div class="field">
            <label for="" class="field__label">Sortowanie</label>
            <InputSelect v-model="filters.sort" placeholder="Sortowanie" :clearVisible="false" :options="sorting" />
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
              <div v-for="fuel in fuels" class="radio">
                <label :for="'fuel' + fuel.id" class="radio-container">
                  <input :id="'fuel' + fuel.id" type="checkbox" :checked="filters.fuels.includes(fuel.id)" @input="onFuelChecked(fuel.id)" />
                  <span class="checkmark"></span>
                </label>
                <label :for="'fuel' + fuel.id" class="fuel_label" :style="{backgroundColor: fuel.color}">
                  <span>
                    {{ fuel.name }}
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>
        <div class="filters__single">
          <div class="radio-group">
            <div class="title">Typ nadwozia</div>
            <div class="fields">
              <div v-for="hullType in hullTypes" class="radio">
                <label :for="'hull_type' + hullType.id" class="radio-container">
                  <input :id="'hull_type' + hullType.id" type="checkbox" :checked="filters.hullTypes.includes(hullType.id)" @input="onHullTypeChecked(hullType.id)" />
                  <span class="checkmark"></span>
                </label>
                <label :for="'hull_type' + hullType.id" class="option-label">{{ hullType.name }}</label>
              </div>
            </div>
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

    .fuels-types {
      @apply flex flex-row items-center justify-start flex-wrap;

      .radio {
        @apply mb-3 mr-4 mt-0;
      }
    }

    .fuel_label {
      @apply w-auto h-auto rounded-md text-xs uppercase font-semibold px-3 py-1.5 leading-3 border border-zinc-600;

      span {
        @apply mix-blend-lighten;
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
