<script setup lang="ts">
import { ExclamationTriangleIcon, CheckIcon } from '@heroicons/vue/24/outline';
import { IconEngine } from '@tabler/icons-vue';
const { models, fetchPending, fetchModels } = useModelsState();
const selectorStatus = ref<'loading' | 'error' | 'loaded'>('loading');

const props = defineProps<{
  modelForm: {
    status: string;
    brand: number | null;
    model: number | null;
    generation: number | null;
    engine: number | null;
    hull_type: number | null;
  }
  disabled: boolean;
  isError: boolean;
}>();
const emit = defineEmits(['onUpdate']);

const modelForm = reactive<{
  status: string;
  brand: number | null;
  model: number | null;
  generation: number | null;
  engine: number | null;
  hull_type: number | null;
}>({
  status: 'published',
  brand: null,
  model: null,
  generation: null,
  engine: null,
  hull_type: null,
});

const availableBrands = ref<
  {
    value: number;
    label: string;
  }[]
>();
const availableModels = ref<
  {
    value: number;
    label: string;
  }[]
>();
const availableGenerations = ref<
  {
    value: number;
    label: string;
  }[]
>();
const availableEngines = ref<
  {
    value: number;
    label: string;
  }[]
>();
const availableHullTypes = ref<
  {
    value: number;
    label: string;
  }[]
>();

const selectedGeneration = computed(() => {
  if (models.value && modelForm.generation != null) {
    return models.value.find((model) => model.generation_id === modelForm.generation);
  }
  return null;
});

const selectedEngine = computed(() => {
  if (models.value && modelForm.generation != null && modelForm.engine != null) {
    const wantedGeneration = models.value.find((model) => model.generation_id === modelForm.generation);
    if (wantedGeneration) {
      return wantedGeneration.engines.find((engine) => engine.id === modelForm.engine);
    }
  }
  return null;
});
const allInfoFilled = computed(() => {
  return modelForm.brand != null && modelForm.model != null && modelForm.generation != null && modelForm.engine != null && modelForm.hull_type != null;
});

const setUpSelector = () => {
  const filteredBrands: Brand[] = [];
  if(models.value == null) {
    availableBrands.value = [];
    return;
  }
  models.value.forEach((model) => {
    const existing = filteredBrands.find((brand) => brand.id === model.brand.id);
    if (!existing) {
      filteredBrands.push(model.brand);
    }
  });

  availableBrands.value = filteredBrands.map((brand) => ({
    value: brand.id,
    label: brand.name,
  }));
};

const onFormUpdate = () => {
  if (modelForm.brand != null) {
    const filteredModels: ModelGeneration[] = [];
    if(models.value == null) {
      availableModels.value = [];
      return;
    }
    models.value.forEach((model) => {
      if (model.brand.id === modelForm.brand && !filteredModels.find((filteredModel) => filteredModel.model_id === model.model_id)) {
        filteredModels.push(model);
      }
    });

    availableModels.value = filteredModels.map((model) => {
      return {
        value: model.model_id,
        label: model.model,
      };
    });
  } else {
    availableModels.value = [];
    modelForm.model = null;
  }

  if (modelForm.model != null) {
    const filteredGenerations: ModelGeneration[] = [];
    if(models.value == null) {
      availableGenerations.value = [];
      return;
    }
    models.value.forEach((model) => {
      if (model.model_id === modelForm.model && !filteredGenerations.find((filteredGeneration) => filteredGeneration.generation_id === model.generation_id)) {
        filteredGenerations.push(model);
      }
    });

    availableGenerations.value = filteredGenerations.map((model) => {
      return {
        value: model.generation_id,
        label: model.generation,
      };
    });
  } else {
    availableGenerations.value = [];
    modelForm.generation = null;
  }

  if (modelForm.generation != null) {
    const wantedGeneration = models.value!.find((model) => model.generation_id === modelForm.generation);
    if (wantedGeneration) {
      availableEngines.value = wantedGeneration.engines.map((engine) => {
        return {
          value: engine.id,
          label: `${engine.name} - ${engine.horse_power} KM`,
        };
      });
      availableHullTypes.value = wantedGeneration.hull_types.map((hullType) => {
        return {
          value: hullType.id,
          label: hullType.name,
        };
      });
    }
  } else {
    availableEngines.value = [];
    modelForm.engine = null;
    availableHullTypes.value = [];
    modelForm.hull_type = null;
  }
  emit('onUpdate', modelForm);
};

const onBrandChange = () => {
  modelForm.model = null;
  modelForm.generation = null;
  modelForm.engine = null;
  modelForm.hull_type = null;
};

const onModelChange = () => {
  modelForm.generation = null;
  modelForm.engine = null;
  modelForm.hull_type = null;
};

const onGenerationChange = () => {
  modelForm.engine = null;
  modelForm.hull_type = null;
};

const refreshSelector = () => {};

const loadModels = async () => {
  if (fetchPending.value) return;
  try {
    await fetchModels();
    setUpSelector();
    selectorStatus.value = 'loaded';
  } catch (error) {
    selectorStatus.value = 'error';
  }
};

const readFromProps = () => {
  if(props.modelForm.status != null) {
    modelForm.status = props.modelForm.status;
  }
  if(props.modelForm.brand != null) {
    modelForm.brand = props.modelForm.brand;
  }
  if(props.modelForm.model != null) {
    modelForm.model = props.modelForm.model;
  }
  if(props.modelForm.generation != null) {
    modelForm.generation = props.modelForm.generation;
  }
  if(props.modelForm.engine != null) {
    modelForm.engine = props.modelForm.engine;
  }
  if(props.modelForm.hull_type != null) {
    modelForm.hull_type = props.modelForm.hull_type;
  }
}

const reloadPage = () => {
  window.location.reload();
}

onMounted(() => {
  readFromProps();
  loadModels();
});

watch(models, () => {
  if (models.value != null) {
    setUpSelector();
    selectorStatus.value = 'loaded';
  }
});

watch(modelForm, () => {
  onFormUpdate();
});

watch(props, () => {
  readFromProps();
}, { deep: true });
</script>

<template>
  <div class="model-selector">
    <Transition name="fade" mode="out-in">
      <div v-if="selectorStatus === 'loading' && !isError" class="model-selector__loader">
        <div class="loader">
          <div></div>
          <div></div>
          <div></div>
        </div>
        <div class="note">Ładowanie modeli</div>
      </div>
      <div v-else-if="isError" class="model-selector__error">
        <ExclamationTriangleIcon class="icon" />
        <div class="title">Brak instrukcji</div>
        <p class="description">Nie udało się załadować instrukcji naprawy.</p>
        <button class="text-button text-button__small text-button__secondary" @click="reloadPage()">Odśwież stronę</button>
      </div>
      <div v-else-if="selectorStatus === 'error' && !isError" class="model-selector__error">
        <ExclamationTriangleIcon class="icon" />
        <div class="title">Brak modeli</div>
        <p class="description">Nie udało się załadować listy modeli.</p>
        <button class="text-button text-button__small text-button__secondary" @click="refreshSelector()">Spróbuj ponownie</button>
      </div>
      <div v-else-if="selectorStatus === 'loaded' && !isError" class="model-selector__container">
        <h5 class="model-selector__title">Opcje instrukcji</h5>
        <div class="model-selector__single">
          <div class="field">
            <label class="field__label">Status publikacji</label>
            <InputSelect v-model="modelForm.status" :disabled="props.disabled" placeholder="Status" :clearVisible="false" :options="[
              {
                value: 'published',
                label: 'Opublikowana',
              },
              {
                value: 'draft',
                label: 'Szkic',
              }
            ]" />
          </div>
        </div>
        <h5 class="model-selector__title">Wybór modelu</h5>
        <div class="model-image">
          <Image :src="selectedGeneration ? selectedGeneration.image : null" alt="car" />
        </div>
        <div class="model-selector__single">
          <div class="field">
            <label class="field__label">Marka pojazdu</label>
            <InputSelect v-model="modelForm.brand" :disabled="props.disabled" placeholder="Marka" :clearVisible="true" :options="availableBrands" @onUpdate="onBrandChange()" />
          </div>
        </div>
        <Transition name="fade">
          <div v-if="modelForm.brand != null" class="model-selector__single">
            <div class="field">
              <label class="field__label">Model pojazdu</label>
              <InputSelect v-model="modelForm.model" :disabled="props.disabled" placeholder="Model pojazdu" :clearVisible="true" :options="availableModels" @onUpdate="onModelChange()" />
            </div>
          </div>
        </Transition>
        <Transition name="fade">
          <div v-if="modelForm.model != null" class="model-selector__single">
            <div class="field">
              <label class="field__label">Generacja pojazdu</label>
              <InputSelect v-model="modelForm.generation" :disabled="props.disabled" placeholder="Model pojazdu" :clearVisible="true" :options="availableGenerations" @onUpdate="onGenerationChange()" />
            </div>
          </div>
        </Transition>
        <Transition name="fade">
          <div v-if="modelForm.generation != null" class="model-selector__single">
            <div class="field">
              <label class="field__label">Silnik</label>
              <InputSelect v-model="modelForm.engine" :disabled="props.disabled" placeholder="Silnik" :clearVisible="true" :options="availableEngines" />
            </div>
          </div>
        </Transition>
        <Transition name="fade">
          <div v-if="modelForm.generation != null && modelForm.engine != null" class="engine-info">
            <div class="label">
              <IconEngine class="icon" />
              <span>Silnik</span>
            </div>
            <div class="value">
              <div class="fuel_mark" :style="{ backgroundColor: selectedEngine ? selectedEngine.fuel.color : '#000' }">
                {{ selectedEngine ? selectedEngine.fuel.name : '--' }}
              </div>
              <div class="name">
                {{ selectedEngine ? selectedEngine.name : 'Nieznany' }}
              </div>
            </div>
            <div class="details">
              <div v-if="selectedEngine && selectedEngine.horse_power != null" class="detail">Moc: {{ selectedEngine.horse_power }} KM</div>
              <div v-if="selectedEngine && selectedEngine.capacity != null" class="detail">Pojemność: {{ selectedEngine.capacity }} cm<sup>3</sup></div>
            </div>
          </div>
        </Transition>
        <Transition name="fade">
          <div v-if="modelForm.generation != null" class="model-selector__single">
            <div class="field">
              <label class="field__label">Typ nadwozia</label>
              <InputSelect v-model="modelForm.hull_type" :disabled="props.disabled" placeholder="Nadwozie" :clearVisible="true" :options="availableHullTypes" />
            </div>
          </div>
        </Transition>
        <Transition name="fade">
          <div v-if="allInfoFilled" class="all-filled">
            <CheckIcon class="icon" />
            <span>
              Wszystkie informacje zostały uzupełnione
            </span>
          </div>
        </Transition>
      </div>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
.model-selector {
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

    .model-image {
      @apply w-full h-auto aspect-video rounded-lg overflow-hidden bg-zinc-800 mb-3;
    }

    .engine-info {
      @apply w-full h-auto rounded-lg border border-zinc-600 p-3 mb-3;

      .label {
        @apply w-full h-auto flex items-center space-x-2 text-neutral-400 mb-3;

        .icon {
          @apply w-4 h-4;
        }

        span {
          @apply text-sm font-extralight;
          @apply md:text-xs;
        }
      }

      .value {
        @apply w-full h-auto flex items-center justify-start space-x-1 mb-1.5;

        .fuel_mark {
          @apply w-auto h-auto rounded-md text-sm uppercase font-semibold px-2 py-1.5 mr-1 mb-1 leading-3 border border-zinc-600;
          @apply lg:text-2xs lg:px-1.5 lg:py-1;

          span {
            @apply mix-blend-lighten;
          }
        }
      }

      .details {
        @apply flex items-center justify-start space-x-3;

        .detail {
          @apply text-xs font-light text-zinc-400;
        }
      }
    }

    .all-filled {
      @apply w-full h-auto flex items-center space-x-2 p-3 mb-3 border border-zinc-600 rounded-lg text-green-600;
      
      .icon {
        @apply w-6 h-6;
      }

      span {
        @apply text-xs;
      }
    }
  }

  &__single {
    @apply w-full h-auto mb-3;
  }

  &__title {
    @apply mb-4;
  }
}
</style>
