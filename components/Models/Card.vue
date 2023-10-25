<script setup lang="ts">
import { ModelGeneration, Engine } from '~/composables/store/vehicle-models/models.model';

const { model } = defineProps<{
  model: ModelGeneration;
}>();
const fuels = ref<Fuel[]>([]);

onMounted(() => {
  const parsedFuels: Fuel[] = [];

  model.engines.forEach((engine: Engine) => {
    const fuel = parsedFuels.find((fuel: Fuel) => fuel.id === engine.fuel.id);
    if (!fuel) {
      parsedFuels.push({
        ...engine.fuel
      });
    }
  });
  fuels.value = parsedFuels;
});
</script>

<template>
  <NuxtLink :to="{ path: '/', query: { brand: model.brand.id, model: model.model_id, generation: model.generation_id } }" class="model_container">
    <div class="model-image">
      <Image :src="model.image"></Image>
    </div>
    <div class="model_info">
      <div class="model">
        <p>{{ model.brand.name + ' ' + model.model + ' ' + model.generation }} {{ model.production_start != null && model.production_end != null ? `(${new Date(model.production_start).getFullYear()} - ${new Date(model.production_end).getFullYear()})` : '' }}</p>
      </div>
      <div class="brand">
        <div class="brand__mark">
          <Image :src="model.brand.logo" alt="unknown" altClass="w-4 h-4 text-zinc-600" fit="contain"></Image>
        </div>
        <p>{{ model.brand.name }}</p>
      </div>
      <div class="fuels">
        <div v-for="fuel in fuels" class="fuel_mark" :style="{backgroundColor: fuel.color}">
          <span>{{ fuel.name }}</span>
        </div>
      </div>
      <div class="hull_types">
        <div v-for="hullType in model.hull_types" class="type">
          <div class="dot"></div>
          <p>{{ hullType.name }}</p>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>

<style scoped lang="scss">
.model_container {
  @apply w-full h-auto rounded-md bg-zinc-900 duration-150 overflow-hidden cursor-pointer;
  @apply hover:ring-1 hover:ring-darkCyan;

  .model-image {
    @apply w-full h-auto bg-zinc-900 overflow-hidden;
    aspect-ratio: 16/9;

    @screen sm {
      aspect-ratio: 3/2;
    }

    img {
      @apply w-full h-full object-center object-cover duration-150;
    }

    .placeholder {
      @apply w-full h-full flex items-center justify-center;

      &__icon {
        @apply w-16 h-16 text-zinc-600;
      }
    }
  }

  .model_info {
    @apply w-full h-auto p-3;

    .model {
      @apply w-full h-auto text-lg text-white mb-2;
      @apply lg:text-sm lg:mb-1;
    }

    .brand {
      @apply w-full h-auto flex items-center space-x-2 mb-3;
      @apply lg:mb-2;

      &__mark {
        @apply w-6 h-6 rounded-md bg-zinc-100 flex items-center justify-center overflow-hidden;
        @apply lg:w-5 lg:h-5;
      }

      p {
        @apply text-zinc-300;
        @apply lg:text-sm;
      }
    }

    .fuels {
      @apply w-full h-auto flex items-center flex-wrap mb-1;

      .fuel_mark {
        @apply w-auto h-auto rounded-md text-sm uppercase font-semibold px-2 py-1.5 mr-1 mb-1 leading-3 border border-zinc-600;
        @apply lg:text-2xs lg:px-1.5 lg:py-1;

        span {
          @apply mix-blend-lighten;
        }
      }
    }

    .hull_types {
      @apply w-full h-auto flex items-center flex-wrap;

      .type {
        @apply w-auto h-auto flex items-center space-x-1.5 mr-2 mb-1;

        .dot {
          @apply w-1 h-1 rounded-full bg-zinc-400;
        }

        p {
          @apply text-zinc-400 text-base capitalize;
          @apply lg:text-xs;
        }
      }
    }
  }
}
</style>
