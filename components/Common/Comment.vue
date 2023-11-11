<script setup lang="ts">
import dayjs from 'dayjs';
import { FlagIcon, HandThumbDownIcon, HandThumbUpIcon, ArrowUturnLeftIcon, EllipsisVerticalIcon, PencilIcon, TrashIcon } from '@heroicons/vue/24/solid';

const props = defineProps<{
  postId: number;
  comment: PostComment;
}>();

const { showPopup } = usePopups();
const { isLoggedIn } = useAuthState();
const { editComment, deleteComment, rateComment } = usePostsState();
const { createErrorToast, createSuccessToast } = useToasts();

const replyVisible = ref(false);
const editActive = ref(false);
const editCommentValue = ref('');
const commentBlocked = ref(false);

const optionsVisible = ref(false);
const optionsButton = ref<HTMLButtonElement | null>(null);
const optionsList = ref<HTMLDivElement | null>(null);

const commentsToDisplay = ref<PostComment[]>([]);

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

const likeComment = () => {
  if (commentBlocked.value) return;
  commentBlocked.value = true;
  if (props.comment.isLiked) {
    rateComment(props.comment.id, null);
  } else {
    rateComment(props.comment.id, true);
  }
  commentBlocked.value = false;
};

const dislikeComment = () => {
  if (commentBlocked.value) return;
  commentBlocked.value = true;
  if (props.comment.isDisliked) {
    rateComment(props.comment.id, null);
  } else {
    rateComment(props.comment.id, false);
  }
  commentBlocked.value = false;
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
  commentsToDisplay.value = [...commentsToDisplay.value, ...props.comment.children.slice(commentsToDisplay.value.length, commentsToDisplay.value.length + 12)];
};

const invokeEdit = () => {
  editCommentValue.value = props.comment.content;
  editActive.value = true;
};

const closeEdit = () => {
  editActive.value = false;
};

const submitEdit = async () => {
  if (commentBlocked.value) return;
  commentBlocked.value = true;
  if (editCommentValue.value.length === 0) {
    createErrorToast('Edycja komentarza', 'Komentarz nie może być pusty.');
    commentBlocked.value = false;
    return;
  }
  if (editCommentValue.value.length > 1000) {
    createErrorToast('Edycja komentarza', 'Komentarz nie może być dłuższy niż 1000 znaków.');
    commentBlocked.value = false;
    return;
  }
  try {
    await editComment(props.comment.id, editCommentValue.value);
    createSuccessToast('Edycja komentarza', 'Komentarz został zedytowany.');
  } catch (error) {
    console.error(error);
    createErrorToast('Edycja komentarza', 'Nie udało się zedytować komentarza. Spróbuj ponownie później.');
  } finally {
    commentBlocked.value = false;
    closeEdit();
  }
};

const removeComment = async () => {
  if (commentBlocked.value) return;
  commentBlocked.value = true;
  try {
    await deleteComment(props.comment.id);
    createSuccessToast('Usuwanie komentarza', 'Komentarz został usunięty.');
  } catch (error) {
    console.error(error);
    createErrorToast('Usuwanie komentarza', 'Nie udało się usunąć komentarza. Spróbuj ponownie później.');
  } finally {
    commentBlocked.value = false;
  }
};

const reportComment = () => {
  showPopup('reportComment', { commentId: props.comment.id });
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
        <div v-if="comment.status === 'published'" class="avatar">
          <Image :src="comment.author && comment.author.avatar" alt="user" altClass="w-5 h-5 text-zinc-500" loaderClass="w-1 h-1 rounded-full bg-white mr-0.5"></Image>
        </div>
        <div v-else class="avatar">
          <Image :src="null" alt="user" altClass="w-5 h-5 text-zinc-500" loaderClass="w-1 h-1 rounded-full bg-white mr-0.5"></Image>
        </div>
      </div>
      <div class="comment__content">
        <div v-if="comment.status === 'published'" class="header">
          <div class="info">
            <div class="name">{{ comment.author.name }}</div>
            <div class="date">{{ dayjs(comment.date_created).fromNow() }} {{ comment.date_updated ? '(edytowany)' : '' }}</div>
          </div>
          <div class="options">
            <button ref="optionsButton" class="icon-button icon-button__secondary icon-button__small" @click="toggleOptions()">
              <EllipsisVerticalIcon class="button-icon"></EllipsisVerticalIcon>
            </button>
            <Transition name="list">
              <div v-show="optionsVisible" ref="optionsList" class="comment-options">
                <button v-if="isLoggedIn && comment.isUserComment" :disabled="commentBlocked" class="option" @click="invokeEdit()">
                  <PencilIcon class="option-icon"></PencilIcon>
                  <span>Edytuj</span>
                </button>
                <button v-if="isLoggedIn && comment.isUserComment" :disabled="commentBlocked" class="option destructive" @click="removeComment()">
                  <TrashIcon class="option-icon"></TrashIcon>
                  <span>Usuń</span>
                </button>
                <button v-if="!isLoggedIn || !comment.isUserComment" :disabled="commentBlocked" class="option" @click="reportComment()">
                  <FlagIcon class="option-icon"></FlagIcon>
                  <span>Zgłoś</span>
                </button>
              </div>
            </Transition>
          </div>
        </div>
        <div v-if="comment.status === 'deleted'" class="header font-bold">Komentarz usunięty</div>
        <div v-if="comment.status === 'blocked'" class="header font-bold">Komentarz zablokowany</div>
        <template v-if="!editActive">
          <div v-if="comment.status === 'published'" class="content">{{ comment.content }}</div>
          <div v-if="comment.status === 'deleted'" class="content removed">Ten komentarz został usunięty przez jego autora.</div>
          <div v-if="comment.status === 'blocked'" class="content removed">Ten komentarz został usunięty przez moderatora.</div>
          <div class="options">
            <div class="start">
              <button
                v-if="comment.status === 'published'"
                :disabled="!isLoggedIn || commentBlocked"
                class="text-button text-button__thertiary text-button__small"
                :class="{ 'like-active': comment.isLiked, 'force-disable': commentBlocked }"
                @click="likeComment()"
              >
                <HandThumbUpIcon class="button-icon" />
                <span>{{ comment.likes }}</span>
              </button>
              <button
                v-if="comment.status === 'published'"
                :disabled="!isLoggedIn || commentBlocked"
                class="text-button text-button__thertiary text-button__small"
                :class="{ 'dislike-active': comment.isDisliked, 'force-disable': commentBlocked }"
                @click="dislikeComment()"
              >
                <HandThumbDownIcon class="button-icon" />
                <span>{{ comment.dislikes }}</span>
              </button>
              <button :disabled="commentBlocked" class="text-button text-button__thertiary text-button__small" :class="{ 'force-disable': commentBlocked }" @click="replyToComment()">
                <ArrowUturnLeftIcon class="button-icon" />
                <span>Odpowiedz</span>
              </button>
            </div>
          </div>
        </template>
        <template v-if="editActive">
          <div class="editable-content">
            <textarea v-model="editCommentValue"></textarea>
          </div>
          <div class="edit-options">
            <button :disabled="commentBlocked" class="text-button text-button__primary text-button__small" :class="{ 'force-disable': commentBlocked }" @click="submitEdit()">
              <span>Zapisz</span>
            </button>
            <button :disabled="commentBlocked" class="text-button text-button__secondary text-button__small" :class="{ 'force-disable': commentBlocked }" @click="closeEdit()">
              <span>Anuluj</span>
            </button>
          </div>
        </template>
      </div>
    </div>
    <div v-if="comment.children.length > 0" class="replies">
      <CommonReply v-for="reply in comment.children" :comment="reply" @onReply="replyToComment()" />
      <div v-if="commentsToDisplay.length > comment.children.length" class="see-more-replies">
        <button class="text-button text-button__thertiary text-button__small" @click="loadMoreReplies()">
          <EllipsisVerticalIcon class="button-icon"></EllipsisVerticalIcon>
          <span>Więcej odpowiedzi</span>
        </button>
      </div>
    </div>
    <Transition name="fade">
      <div v-if="replyVisible" class="write-reply">
        <CommonWriteComment :postId="props.postId" :parent="props.comment.id" @closeClicked="hideReply()" />
      </div>
    </Transition>
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

          .option:disabled {
            @apply pointer-events-none opacity-50;
          }
        }
      }
    }

    .content {
      @apply w-full h-auto text-xs mb-2;

      &.removed {
        @apply font-light italic;
      }
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

      .force-disable {
        @apply opacity-50;
      }
    }

    .editable-content {
      @apply w-full h-auto relative;

      textarea {
        @apply w-full h-16 bg-zinc-900 border border-zinc-700 rounded-md text-xs resize-none overflow-y-auto p-2;
      }
    }

    .edit-options {
      @apply w-full h-auto flex items-center justify-end space-x-2;
    }
  }
}

.replies {
  @apply w-full h-auto pl-14;

  .see-more-replies {
    @apply w-full h-auto flex items-center justify-end mb-2;
  }
}

.write-reply {
  @apply w-full h-auto pl-14;
}
</style>
