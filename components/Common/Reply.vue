<script setup lang="ts">
import dayjs from 'dayjs';
import { FlagIcon, HandThumbDownIcon, HandThumbUpIcon, ArrowUturnLeftIcon, EllipsisHorizontalIcon, PencilIcon } from '@heroicons/vue/24/solid';

const { comment } = defineProps<{
  comment: PostComment;
}>();
const emit = defineEmits(['onReply']);

const { isLoggedIn } = useAuthState();

const optionsVisible = ref(false);
const optionsButton = ref<HTMLButtonElement | null>(null);
const optionsList = ref<HTMLDivElement | null>(null);

const toggleOptions = () => {
  optionsVisible.value = !optionsVisible.value;
}

const clickedOutside = (event: MouseEvent) => {
  if(!optionsVisible.value) return;
  const isTarget = optionsButton.value === event.target;
  const clickedInside = optionsButton.value?.contains(event.target as Node);

  if(!isTarget && !clickedInside) {
    optionsVisible.value = false;
  }
}

onMounted(() => {
  document.addEventListener('click', clickedOutside);
});
</script>

<template>
  <div class="reply">
    <div class="reply__avatar">
      <div class="avatar">
          <Image :src="comment.author.avatar" alt="user" altClass="w-5 h-5 text-zinc-500" loaderClass="w-1 h-1 rounded-full bg-white mr-0.5"></Image>
        </div>
      <ArrowUturnLeftIcon class="reply-icon"></ArrowUturnLeftIcon>
    </div>
    <div class="reply__content">
      <div class="header">
        <div class="info">
          <div class="name">{{ comment.author.name }}</div>
            <div class="date">{{ dayjs(comment.date_created).fromNow() }} {{ comment.date_modified ? '(edytowany)' : '' }}</div>
        </div>
        <div class="options">
            <button ref="optionsButton" class="icon-button icon-button__secondary icon-button__small" @click="toggleOptions()">
              <EllipsisHorizontalIcon class="button-icon"></EllipsisHorizontalIcon>
            </button>
            <Transition name="list">
              <div v-show="optionsVisible" ref="optionsList" class="comment-options">
                <button v-if="isLoggedIn && comment.isUserComment" class="option">
                  <PencilIcon class="option-icon"></PencilIcon>
                  <span>Edytuj</span>
                </button>
                <button class="option">
                  <FlagIcon class="option-icon"></FlagIcon>
                  <span>Zgłoś</span>
                </button>
              </div>
            </Transition>
          </div>
      </div>
      <div class="content">{{ comment.content }}</div>
      <div class="options">
        <div class="start">
          <button :disabled="!isLoggedIn" class="text-button text-button__thertiary text-button__small" :class="{'like-active': comment.isLiked}">
              <HandThumbUpIcon class="button-icon" />
              <span>{{ comment.likes }}</span>
            </button>
            <button :disabled="!isLoggedIn" class="text-button text-button__thertiary text-button__small" :class="{'dislike-active': comment.isDisliked}">
              <HandThumbDownIcon class="button-icon" />
              <span>{{ comment.dislikes }}</span>
            </button>
          <button class="text-button text-button__thertiary text-button__small" @click="emit('onReply', null);">
            <ArrowUturnLeftIcon class="button-icon" />
            <span>Odpowiedz</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.reply {
  @apply w-full h-auto flex items-start space-x-2 mb-2;

  &__avatar {
    @apply w-auto h-auto flex-shrink-0 flex flex-col items-center space-y-2;

    .avatar {
      @apply w-10 h-10 rounded-full bg-zinc-900 overflow-hidden;
    }

    .reply-icon {
      @apply w-4 h-4 text-zinc-400;
    }
  }

  &__content {
    @apply w-full h-auto flex-grow bg-zinc-900 rounded-lg p-3;

    .header {
      @apply w-full h-auto flex items-start justify-between mb-1;

      .info {
        @apply flex-grow w-auto h-auto flex items-center space-x-2 text-sm;

        .name {
          @apply font-semibold text-sm;
        }

        .date {
          @apply text-zinc-400 font-light text-xs;
        }
      }

      .options {
        @apply w-auto h-auto relative;

        .icon-button {
          @apply w-6 h-6 rounded-md;
        }

        .comment-options {
          @apply absolute top-full right-0 mt-1;
          @apply w-48 h-auto rounded-lg overflow-hidden bg-zinc-800 border border-zinc-700 mt-1;
          transform-origin: top;

          .option {
            @apply w-full h-auto px-2 py-1.5 text-xs text-left flex items-center space-x-2 duration-200 hover:bg-zinc-700;

            .option-icon {
              @apply w-4 h-4 text-zinc-400;
            }
          }
        }
      }
    }

    .content {
      @apply w-full h-auto text-xs mb-2;
    }

    .options {
      @apply w-full h-auto flex items-center justify-between space-x-4;

      .start {
        @apply w-auto h-auto flex items-center;
      }

      .text-button {
        @apply h-6 px-1.5;
      }

      .text-button:disabled {
        @apply pointer-events-none;
      }

      .like-active {
        @apply bg-green-600 text-white;
      }

      .dislike-active {
        @apply bg-red-600 text-white;
      }
    }
  }
}
</style>
