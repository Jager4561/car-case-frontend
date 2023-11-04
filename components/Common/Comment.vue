<script setup lang="ts">
import dayjs from 'dayjs';
import { FlagIcon, HandThumbDownIcon, HandThumbUpIcon, ArrowUturnLeftIcon, EllipsisHorizontalIcon, PencilIcon, TrashIcon } from '@heroicons/vue/24/solid';

const props = defineProps<{
  postId: number;
  comment: PostComment;
}>();

const { showPopup } = usePopups();
const { isLoggedIn } = useAuthState();

const replyVisible = ref(false);

const optionsVisible = ref(false);
const optionsButton = ref<HTMLButtonElement | null>(null);
const optionsList = ref<HTMLDivElement | null>(null);

const commentsToDisplay = ref<ChildComment[]>([]);

const toggleOptions = () => {
  optionsVisible.value = !optionsVisible.value;
};

const clickedOutside = (event: MouseEvent) => {
  if (!optionsVisible.value) return;
  const isTarget = optionsButton.value === event.target;
  const clickedInside = optionsButton.value?.contains(event.target as Node);

  if (!isTarget && !clickedInside) {
    optionsVisible.value = false;
  }
};

const replyToComment = () => {
  if (!isLoggedIn.value) {
    showPopup('loginToComment');
  } else {
    replyVisible.value = true;
  }
};

const hideReply = () => {
  replyVisible.value = false;
};

const loadMoreReplies = () => {
  commentsToDisplay.value = [
    ...commentsToDisplay.value,
    ...props.comment.children.slice(commentsToDisplay.value.length, commentsToDisplay.value.length + 12),
  ];
};


onMounted(() => {
  document.addEventListener('click', clickedOutside);
  commentsToDisplay.value = props.comment.children.slice(0, 3);
});
</script>

<template>
  <div class="comment-container">
    <div class="comment">
      <div class="comment__avatar">
        <div class="avatar">
          <Image :src="comment.author.avatar" alt="user" altClass="w-5 h-5 text-zinc-500" loaderClass="w-1 h-1 rounded-full bg-white mr-0.5"></Image>
        </div>
      </div>
      <div class="comment__content">
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
                <button v-if="isLoggedIn && comment.isUserComment" class="option destructive">
                  <TrashIcon class="option-icon"></TrashIcon>
                  <span>Usuń</span>
                </button>
                <button v-if="!isLoggedIn || !comment.isUserComment"  class="option">
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
            <button class="text-button text-button__thertiary text-button__small" @click="replyToComment()">
              <ArrowUturnLeftIcon class="button-icon" />
              <span>Odpowiedz</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="comment.children.length > 0" class="replies">
      <CommonReply v-for="reply in comment.children" :comment="reply" @onReply="replyToComment()" />
      <div v-if="commentsToDisplay.length > comment.children.length" class="see-more-replies">
        <button class="text-button text-button__thertiary text-button__small" @click="loadMoreReplies()">
          <EllipsisHorizontalIcon class="button-icon"></EllipsisHorizontalIcon>
          <span>Więcej odpowiedzi</span>
        </button>
      </div>
      <Transition name="fade">
        <div v-if="replyVisible" class="write-reply">
          <CommonWriteComment :postId="props.postId" @closeClicked="hideReply()" />
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped lang="scss">
.comment-container {
  @apply w-full h-auto pl-2;
}

.comment {
  @apply w-full h-auto flex items-start space-x-2 mb-2;

  &__avatar {
    @apply w-auto h-auto flex-shrink-0 flex flex-col items-center space-y-2;

    .avatar {
      @apply w-10 h-10 bg-zinc-900 rounded-full overflow-hidden;
    }

    .reply-icon {
      @apply w-6 h-6 text-zinc-400;
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

            &.destructive {
              @apply text-red-600;

              .option-icon {
                @apply text-red-600;
              } 
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
        @apply text-green-600;
        @apply hover:text-green-400;
      }

      .dislike-active {
        @apply text-red-600;
        @apply hover:text-red-400;
      }
    }
  }
}

.replies {
  @apply w-full h-auto pl-14;

  .see-more-replies {
    @apply w-full h-auto flex items-center justify-end mb-2;
  }
}
</style>
