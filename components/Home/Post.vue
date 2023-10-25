<script setup lang="ts">
import { CalendarIcon, PencilSquareIcon, HandThumbUpIcon, HandThumbDownIcon, ChatBubbleLeftRightIcon, EllipsisHorizontalIcon } from '@heroicons/vue/24/solid';
import dayjs from 'dayjs';
import 'dayjs/locale/pl';
import updateLocale from 'dayjs/plugin/updateLocale';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(updateLocale);
dayjs.extend(relativeTime);

dayjs.locale('pl');

const { post } = defineProps<{
  post: Post;
}>();

const { isLoggedIn } = useAuthState();
const commentsVisible = ref(false);
const commentsToDisplay = ref<PostComment[]>([]);

const toggleComments = () => {
  commentsVisible.value = !commentsVisible.value;
};

const loadMoreComments = () => {
  commentsToDisplay.value = [
    ...commentsToDisplay.value,
    ...post.comments.slice(commentsToDisplay.value.length, commentsToDisplay.value.length + 10),
  ];
};

onMounted(() => {
  commentsToDisplay.value = post.comments.slice(0, 5);
});
</script>

<template>
  <div class="post">
    <div class="post__container">
      <NuxtLink to="/" class="post_header">
        <div class="title">{{ post.title }}</div>
        <div class="publish_info">
          <div class="created">
            <CalendarIcon class="icon" />
            <span>{{ dayjs(post.date_created).fromNow() }}</span>
          </div>
          <div v-if="post.date_modified != null" class="modified">
            <PencilSquareIcon class="icon" />
            <span>{{ dayjs(post.date_modified).fromNow() }}</span>
          </div>
        </div>
      </NuxtLink>
      <NuxtLink to="/" class="short_description">
        <p>{{ post.abstract }}</p>
      </NuxtLink>
      <div class="spacer"></div>
      <div class="post_footer">
        <div class="post_info">
          <NuxtLink :to="{ path: '/', query: { brand: post.model.brand.id, model: post.model.id, generation: post.model.generation.id } }" class="model">
            <div class="model_image">
              <Image :src="post.model.generation.image" alt="car" altClass="w-5 h-5 text-zinc-500" loaderClass="w-1 h-1 rounded-full bg-white mr-0.5"></Image>
            </div>
            <div class="fuel_mark" :style="{ backgroundColor: post.model.engine.fuel.color }">{{ post.model.engine.fuel.name }}</div>
            <span class="model_name">{{ post.model.brand.name + ' ' + post.model.name + ' ' + post.model.generation.name + ' (' + post.model.engine.name + ')' }}</span>
          </NuxtLink>
          <NuxtLink :to="{ path: '/', query: { author: post.author.id } }" class="author">
            <div class="author_image">
              <Image :src="post.author.avatar" alt="user" altClass="w-5 h-5 text-zinc-500" loaderClass="w-1 h-1 rounded-full bg-white mr-0.5"></Image>
            </div>
            <span class="author_name">{{ post.author.name }}</span>
          </NuxtLink>
        </div>
        <div class="post_actions">
          <NuxtLink :to="{ path: '/', query: { author: post.author.id } }" class="author">
            <div class="author_image">
              <Image :src="post.author.avatar" alt="user" altClass="w-5 h-5 text-zinc-500" loaderClass="w-1 h-1 rounded-full bg-white mr-0.5"></Image>
            </div>
            <NuxtImg v-if="post.author.avatar != null" class="author_image" provider="directus" :src="post.author.avatar"></NuxtImg>
            <span class="author_name">{{ post.author.name }}</span>
          </NuxtLink>
          <div class="actions">
            <button class="icon_button" :disabled="!isLoggedIn" :class="{ 'like-active': post.isLiked }">
              <HandThumbUpIcon class="icon" />
              <span class="value">{{ post.likes }}</span>
            </button>
            <button class="icon_button" :disabled="!isLoggedIn" :class="{ 'dislike-active': post.isDisliked }">
              <HandThumbDownIcon class="icon" />
              <span class="value">{{ post.dislikes }}</span>
            </button>
            <button class="icon_button" :disabled="post.comments.length === 0" @click="toggleComments()" :class="{ active: commentsVisible }">
              <ChatBubbleLeftRightIcon class="icon" />
              <span class="value">{{ post.comments.length }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    <Transition name="fade">
      <div v-if="commentsVisible && post.comments.length > 0" class="post__comments">
        <CommonComment v-for="comment in commentsToDisplay" :comment="comment" />
        <div class="see-more-comments">
          <div class="login-note">
            <p v-if="!isLoggedIn"><NuxtLink to="/zaloguj">Zaloguj się </NuxtLink> lub <NuxtLink to="/zarejestruj">zarejestruj</NuxtLink> aby dodać komentarz.</p>
          </div>
          <button v-if="commentsToDisplay.length < post.comments.length" class="text-button text-button__thertiary text-button__small" @click="loadMoreComments()">
            <EllipsisHorizontalIcon class="button-icon"></EllipsisHorizontalIcon>
            <span>Więcej komentarzy</span>
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
.post {
  @apply w-full h-auto mb-3;

  &__container {
    @apply w-full h-auto bg-zinc-900 rounded-lg p-4 duration-150;
    @apply hover:ring-1 hover:ring-darkCyan;

    .post_header {
      @apply w-full h-auto flex flex-col items-start justify-between space-y-2 mb-4 cursor-pointer;
      @apply sm:flex-row sm:space-x-4 sm:space-y-0;

      .title {
        @apply font-bold flex-grow text-lg;
      }

      .publish_info {
        @apply w-auto h-auto flex items-center space-x-2;

        .created,
        .modified {
          @apply w-auto h-auto flex items-center space-x-2 text-zinc-400;

          svg {
            @apply w-4 h-4;
          }

          span {
            @apply text-xs font-normal;
          }
        }
      }
    }

    .short_description {
      @apply w-full h-auto text-sm;
    }

    .spacer {
      @apply w-full h-0.5 bg-zinc-600 my-4;
    }

    .post_footer {
      @apply w-full h-auto flex flex-col items-start justify-between;
      @apply sm:flex-row;
      @apply lg:flex-col;
      @apply xl:flex-row;

      .post_info {
        @apply w-auto h-auto flex items-center space-x-2 mb-4;
        @apply sm:mb-0;
        @apply lg:mb-4;
        @apply xl:mb-0;

        .model {
          @apply w-auto h-auto flex items-center space-x-2 rounded-lg duration-150 pr-2;
          @apply hover:bg-zinc-800 hover:text-white;

          .model_image {
            @apply w-8 h-8 rounded-lg bg-zinc-800 flex-shrink-0 overflow-hidden;
          }

          .fuel_mark {
            @apply w-auto h-auto rounded-md text-2xs font-semibold border border-zinc-600 px-1 py-0.5;
          }

          .model_name {
            @apply text-xs text-left font-bold whitespace-nowrap;
          }
        }

        .author {
          @apply hidden sm:flex;
          @apply lg:hidden;
          @apply xl:flex;
        }
      }

      .post_actions {
        @apply w-full h-auto flex items-center justify-between space-x-1;
        @apply sm:w-auto sm:justify-end;
        @apply lg:w-full lg:justify-between;
        @apply xl:w-auto xl:justify-end;

        .author {
          @apply sm:hidden;
          @apply lg:flex;
          @apply xl:hidden;
        }

        .actions {
          @apply w-auto h-auto flex items-center space-x-1;

          .icon_button {
            @apply w-auto h-auto flex items-center space-x-1 p-1.5 rounded-lg text-gray-400 duration-150;
            @apply hover:bg-zinc-800 hover:text-white;

            .icon {
              @apply w-5 h-5;
            }

            .value {
              @apply text-sm font-medium;
            }

            .like-active {
              @apply bg-green-600 text-white;
            }

            .dislike-active {
              @apply bg-red-600 text-white;
            }
          }

          .icon_button.active {
            @apply bg-zinc-800 text-darkCyan;
          }

          .icon_button:disabled {
            @apply pointer-events-none;
          }
        }
      }
      .author {
        @apply w-auto h-auto flex items-center space-x-2 rounded-full duration-150 pr-2;
        @apply hover:bg-zinc-800 hover:text-white;

        .author_image {
          @apply w-8 h-8 bg-zinc-800 rounded-full flex-shrink-0 overflow-hidden;
        }

        .author_name {
          @apply text-xs font-bold text-left whitespace-nowrap;
        }
      }
    }
  }

  &__comments {
    @apply w-full h-auto mt-2;

    .see-more-comments {
      @apply w-full h-auto flex items-center justify-between mb-2;

      .login-note {
        @apply w-auto h-auto text-xs text-zinc-400;

        a {
          @apply text-zinc-200 duration-200 hover:text-darkCyan cursor-pointer;
        }
      }
    }
  }
}
</style>