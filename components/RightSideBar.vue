<script setup lang="ts">
import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline';
const { models, fetchPending, fetchModels } = useModelsState();

const componentStatus = ref<'loading' | 'error' | 'loaded' | 'empty'>('loading');
const currentYear = ref(new Date().getFullYear());

const modelsToDisplay = computed(() => {
  if (models.value) {
    return models.value.sort((a, b) => {
      return b.posts_count - a.posts_count;
    }).slice(0, 3);
  }
  return [];
});

const loadModels = async () => {
  if(fetchPending.value) return;
  try {
    if (models.value == null) {
      await fetchModels();
    }
    if (models.value != null) {
      componentStatus.value = 'loaded';
    } else {
      componentStatus.value = 'error';
    }
  } catch (error) {
    componentStatus.value = 'error';
  }
};

onMounted(() => {
  loadModels();
});

watch(models, () => {
  loadModels();
});
</script>

<template>
  <div class="sidebar_container">
    <div class="top">
      <div class="most_popular_models">
        <h6 class="title">Najpopularniejsze modele</h6>
        <div v-if="componentStatus == 'loading'" class="loader-wrapper">
          <div class="loader">
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
        <div v-if="componentStatus == 'error'" class="error-note">
          <ExclamationTriangleIcon class="icon" />
          <div class="title">Wystąpił błąd podczas ładowania modeli.</div>
        </div>

        <div v-if="componentStatus == 'loaded'" class="cars_list">
          <div v-if="modelsToDisplay.length === 0" class="empty">
            Brak modeli do wyświetlenia.
          </div>
          <NuxtLink v-for="(model, index) in modelsToDisplay" :to="{ path: '/', query: { brand: model.brand.id, model: model.model_id, generation: model.generation_id } }"  class="popular_car">
            <div class="start">
              <div class="car_image">
                <Image :src="model.image" alt="car" altClass="w-5 h-5 text-zinc-500" loaderClass="w-1 h-1 rounded-full bg-white mr-0.5"></Image>
              </div>
              <div class="car_info">
                <p class="model">{{ model.model + ' ' + model.generation }}</p>
                <p class="brand">{{ model.brand.name }}</p>
              </div>
            </div>
            <div class="end">
              <div class="value">{{ model.posts_count }}</div>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="trophy" :class="{
                'text-yellow-300': index === 0,
                'text-gray-400': index === 1,
                'text-yellow-700': index === 2,
              }">
                <path
                  fill-rule="evenodd"
                  d="M5.166 2.621v.858c-1.035.148-2.059.33-3.071.543a.75.75 0 00-.584.859 6.753 6.753 0 006.138 5.6 6.73 6.73 0 002.743 1.346A6.707 6.707 0 019.279 15H8.54c-1.036 0-1.875.84-1.875 1.875V19.5h-.75a2.25 2.25 0 00-2.25 2.25c0 .414.336.75.75.75h15a.75.75 0 00.75-.75 2.25 2.25 0 00-2.25-2.25h-.75v-2.625c0-1.036-.84-1.875-1.875-1.875h-.739a6.706 6.706 0 01-1.112-3.173 6.73 6.73 0 002.743-1.347 6.753 6.753 0 006.139-5.6.75.75 0 00-.585-.858 47.077 47.077 0 00-3.07-.543V2.62a.75.75 0 00-.658-.744 49.22 49.22 0 00-6.093-.377c-2.063 0-4.096.128-6.093.377a.75.75 0 00-.657.744zm0 2.629c0 1.196.312 2.32.857 3.294A5.266 5.266 0 013.16 5.337a45.6 45.6 0 012.006-.343v.256zm13.5 0v-.256c.674.1 1.343.214 2.006.343a5.265 5.265 0 01-2.863 3.207 6.72 6.72 0 00.857-3.294z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>
    <div class="bottom_part">
      <div class="advert">
        <NuxtImg src="img/uken_logo.webp" alt="Uken logo"></NuxtImg>
        <p>Projekt stworzony na potrzeby pracy inżynierskiej na Instytucie Nauk Technicznych Uniwersytetu Komisji Edukacji Narodowej w Krakowie.</p>
      </div>
      <div class="copyright">Copyright &copy; {{ currentYear }} - Wojciech Cyrwus</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.sidebar_container {
  @apply w-full h-full p-4 flex flex-col justify-between;
  @apply lg:p-6 lg:pl-0;

  .top {
    @apply w-full h-auto;

    .most_popular_models {
      @apply w-full h-auto rounded-md bg-zinc-900 p-4;

      .title {
        @apply text-xs text-zinc-400 font-medium mb-4;
      }

      .loader-wrapper {
        @apply w-full h-auto flex items-center justify-center py-6;
      }

      .error-note {
        @apply w-full h-auto flex flex-col items-center justify-center py-6;

        .icon {
          @apply w-8 h-8 text-red-600 mb-2;
        }

        .title {
          @apply w-auto h-auto text-red-600 text-xs mb-0;
        }
      }

      .cars_list {
        @apply w-full h-auto space-y-4;

        .empty {
          @apply w-full h-auto text-center text-zinc-400 text-xs py-6;
        }

        .popular_car {
          @apply w-full h-auto rounded-md flex items-center justify-between space-x-4 duration-150;
          @apply hover:bg-zinc-800;

          .start {
            @apply flex items-center space-x-2;

            .car_image {
              @apply w-12 h-12 rounded-md duration-150 overflow-hidden;
            }

            .car_info {
              .model {
                @apply font-semibold;
              }
              .brand {
                @apply text-sm font-light text-zinc-400;
              }
            }
          }

          .end {
            @apply flex items-center space-x-2 pr-2;

            .icon {
              @apply w-4 h-4 text-zinc-400;
            }

            .trophy {
              @apply w-5 h-5;
            }
          }
        }

        .popular_car:hover {
          .car_image {
            @apply rounded-r-none;
          }
        }
      }
    }
  }

  .bottom_part {
    @apply w-full h-auto;

    .advert {
      @apply w-full h-auto bg-white p-4 text-black rounded-md flex items-center space-x-6 mb-3;

      img {
        @apply w-12 h-12;
      }

      p {
        @apply text-xs font-medium;
      }
    }

    .copyright {
      @apply w-full h-auto bg-zinc-900 rounded-lg text-zinc-400 text-sm font-light p-3;
      @apply lg:text-xs;
    }
  }
}
</style>
