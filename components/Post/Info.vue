<script setup lang="ts">
import {
  ExclamationTriangleIcon,
  CalendarIcon,
  PencilSquareIcon,
  UserCircleIcon,
  HandThumbDownIcon,
  HandThumbUpIcon,
  ChatBubbleLeftRightIcon,
  PresentationChartBarIcon,
} from '@heroicons/vue/24/outline';
import { IconAssembly, IconCar, IconSortAscendingNumbers, IconEngine, IconCylinder, IconBolt, IconGasStation, IconCarSuv } from '@tabler/icons-vue';
import { DetailedPost } from '@/composables/store/posts/posts.model';
import dayjs from 'dayjs';

const props = withDefaults(
  defineProps<{
    status: 'loading' | 'error' | 'success';
    post: DetailedPost;
  }>(),
  {
    status: 'loading',
  }
);
const { ratePost, deleteRating } = usePostsState();

const { isLoggedIn } = useAuthState();

const goToCommentsSection = () => {
  const commentsSection = document.getElementById('comments');
  if(commentsSection) {
    commentsSection.scrollIntoView({ behavior: 'smooth' });
  }
};
</script>

<template>
  <div class="vehicle-info">
    <Transition name="fade" mode="out-in">
      <div v-if="props.status === 'loading'" class="vehicle-info__loader">
        <div class="loader">
          <div></div>
          <div></div>
          <div></div>
        </div>
        <div class="note">Ładowanie informacji</div>
      </div>
      <div v-else-if="props.status === 'success'" class="vehicle-info__container">
        <h5 class="vehicle-info__title">Informacje o instrukcji</h5>
        <div class="single-info">
          <div class="label">
            <CalendarIcon class="icon" />
            <span>Data utworzenia</span>
          </div>
          <div class="value">
            {{ dayjs(props.post.date_created).format('DD.MM.YYYY') }}
          </div>
        </div>
        <div class="single-info">
          <div class="label">
            <PencilSquareIcon class="icon" />
            <span>Data modyfikacji</span>
          </div>
          <div v-if="props.post.date_modified" class="value">
            {{ dayjs(props.post.date_modified).format('DD.MM.YYYY') }}
          </div>
          <div v-if="!props.post.date_modified" class="value value-disabled">Nie zmodyfikowano</div>
        </div>
        <NuxtLink :to="{ path: '/', query: { author: post.author.id } }" class="single-info clickable">
          <div class="label">
            <UserCircleIcon class="icon" />
            <span>Autor</span>
          </div>
          <div class="post-author">
            <div class="avatar">
              <Image :src="post.author.avatar" alt="user" altClass="w-5 h-5 text-zinc-500" loaderClass="w-1 h-1 rounded-full bg-white mr-0.5"></Image>
            </div>
            <div class="name">
              {{ props.post.author.name }}
            </div>
          </div>
        </NuxtLink>
        <div class="single-info last-in-section">
          <div class="label">
            <PresentationChartBarIcon class="icon" />
            <span>Statystyki</span>
          </div>
          <div class="rating-stats">
            <button :disabled="!isLoggedIn" class="stat" :class="{ 'like-active': post.isLiked }" @click="!post.isLiked ? ratePost(post.id, true) : deleteRating(post.id)">
              <HandThumbUpIcon class="icon" />
              <span>{{ props.post.likes }}</span>
            </button>
            <button :disabled="!isLoggedIn" class="stat" :class="{ 'dislike-active': post.isDisliked }" @click="!post.isDisliked ? ratePost(post.id, false) : deleteRating(post.id)">
              <HandThumbDownIcon class="icon" />
              <span>{{ props.post.dislikes }}</span>
            </button>
            <button class="stat" @click="goToCommentsSection()">
              <ChatBubbleLeftRightIcon class="icon" />
              <span>{{ props.post.comments.length }}</span>
            </button>
          </div>
        </div>
        <h5 class="vehicle-info__title">Informacje o modelu</h5>
        <div class="model-image">
          <Image :src="post.model.generation.image"></Image>
        </div>
        <NuxtLink :to="{ path: '/', query: { brand: post.model.brand.id } }" class="single-info clickable">
          <div class="label">
            <IconAssembly class="icon" />
            <span>Marka pojazdu</span>
          </div>
          <div class="value brand">
            <div class="brand-icon">
              <Image :src="post.model.brand.logo" alt="unknown" altClass="w-4 h-4 text-zinc-600" fit="contain"></Image>
            </div>
            <span class="name">
              {{ post.model.brand.name }}
            </span>
          </div>
        </NuxtLink>
        <div class="info-row">
          <NuxtLink :to="{ path: '/', query: { model: post.model.id } }" class="single-info clickable">
            <div class="label">
              <IconCar class="icon" />
              <span>Model pojazdu</span>
            </div>
            <div class="value clickable">
              {{ post.model.name }}
            </div>
          </NuxtLink>
          <NuxtLink :to="{ path: '/', query: { generation: post.model.generation.id } }" class="single-info clickable">
            <div class="label">
              <IconSortAscendingNumbers class="icon" />
              <span>Generacja</span>
            </div>
            <div class="value">
              {{ post.model.generation.name }}
            </div>
          </NuxtLink>
          <div class="single-info">
            <div class="label">
              <IconEngine class="icon" />
              <span>Silnik</span>
            </div>
            <div class="value">
              {{ post.model.engine.name }}
            </div>
          </div>
          <div class="single-info">
            <div class="label">
              <IconCylinder class="icon" />
              <span>Pojemność</span>
            </div>
            <div class="value">{{ post.model.engine.capacity }} cm<sup>3</sup></div>
          </div>
          <div class="single-info">
            <div class="label">
              <IconBolt class="icon" />
              <span>Moc</span>
            </div>
            <div class="value">{{ post.model.engine.horse_power }} KM</div>
          </div>
          <div class="single-info fuel">
            <div class="label">
              <IconGasStation class="icon" />
              <span>Paliwo</span>
            </div>
            <div class="value" :style="{ backgroundColor: post.model.engine.fuel.color }">{{ post.model.engine.fuel.name }}</div>
          </div>
        </div>
        <div class="single-info">
          <div class="label">
            <IconCarSuv class="icon" />
            <span>Typ podwozia</span>
          </div>
          <div class="value">{{ post.model.hull_type.name }}</div>
        </div>
      </div>
      <div v-else class="vehicle-info__error">
        <ExclamationTriangleIcon class="icon" />
        <div class="title">Brak informacji</div>
        <p class="description">Nie udało się załadować informacji o instrukcji.</p>
      </div>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
.vehicle-info {
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

  .single-info {
    @apply w-full h-auto rounded-lg border border-zinc-600 p-3 mb-3;

    .label {
      @apply w-full h-auto flex items-center space-x-2 text-neutral-400 mb-2;

      .icon {
        @apply w-4 h-4;
      }

      span {
        @apply text-sm font-extralight;
        @apply md:text-xs;
      }
    }

    .value {
      @apply text-lg font-light;
      @apply md:text-sm;
    }

    .value-disabled {
      @apply text-neutral-400;
    }
  }

  .info-row {
    @apply w-full h-auto grid grid-cols-2 gap-3 mb-3;

    .single-info {
      @apply mb-0;
    }
  }

  .post-author {
    @apply w-full h-auto flex items-center space-x-3 rounded-full duration-150;
    @apply hover:bg-zinc-800 hover:text-white;

    .avatar {
      @apply w-14 h-14 rounded-full overflow-hidden;
      @apply md:w-10 md:h-10;
    }

    .name {
      @apply text-lg leading-3;
      @apply md:text-sm;
    }
  }

  .rating-stats {
    @apply w-full h-auto flex items-center justify-around;

    .stat {
      @apply w-auto h-auto flex items-center space-x-2 p-2 rounded-lg text-gray-400 duration-150;
      @apply hover:bg-zinc-800 hover:text-white;

      .icon {
        @apply w-6 h-6;
      }

      &:disabled {
        @apply pointer-events-none;
      }

      &.like-active {
        @apply text-green-600;
      }

      &.dislike-active {
        @apply text-red-600;
      }
    }
  }

  .model-image {
    @apply w-full aspect-video h-auto rounded-lg overflow-hidden mb-4;
  }

  .brand {
    @apply w-full h-8 flex items-center rounded-lg space-x-2 duration-150;
    @apply hover:bg-zinc-800;

    .brand-icon {
      @apply w-8 h-8 rounded-md bg-zinc-100 flex items-center justify-center overflow-hidden;
    }
  }

  .clickable {
    @apply w-full h-auto block duration-150;
    @apply hover:bg-zinc-800;
  }

  .fuel {
    @apply flex flex-col items-start;
    .value {
      @apply w-auto h-auto px-2 py-1 rounded-md text-xs uppercase font-semibold border border-zinc-600;
    }
  }

  .last-in-section {
    @apply mb-4;
  }
}
</style>
