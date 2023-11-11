<script setup lang="ts">
import { PaperAirplaneIcon, XMarkIcon } from '@heroicons/vue/24/solid';

const { createWarningToast } = useToasts();
const { addComment } = usePostsState();
const { account } = useAccount();
const props = withDefaults(
  defineProps<{
    postId: number,
    parent?: number,
    closeActive?: boolean,
  }>(),
  {
    closeActive: true
  }
);
const emit = defineEmits(['closeClicked']);
const isFormPending = ref(false);
const comment = ref('');

const addNewComment = async () => {
  if(isFormPending.value) return;
  if(comment.value.length === 0) {
    createWarningToast('Dodawanie komentarza', 'Komentarz nie może być pusty.');
    return;
  }
  if(comment.value.length > 1000) {
    createWarningToast('Dodawanie komentarza', 'Komentarz nie może być dłuższy niż 1000 znaków.');
    return;
  }
  isFormPending.value = true;
  try {
    await addComment(props.postId, comment.value, props.parent);
    comment.value = '';
  } catch (error) {
    createWarningToast('Dodawanie komentarza', 'Wystąpił błąd podczas dodawania komentarza.');
  } finally {
    isFormPending.value = false;
  }
}

const closeField = () => {
  if(isFormPending.value) return;
  emit('closeClicked');
};
</script>

<template>
  <form class="write-comment" @submit.prevent="addNewComment()">
    <div class="write-comment__top">
      <div class="write-comment__avatar">
        <div class="avatar">
          <Image :src="account != null ? account.avatar : null" alt="user" altClass="w-5 h-5 text-zinc-500" loaderClass="w-1 h-1 rounded-full bg-white mr-0.5" />
        </div>
      </div>
      <div class="write-comment__content">
        <textarea v-model="comment"></textarea>
      </div>
    </div>
    <div class="write-comment__actions">
      <div class="char-limit" :class="{'alert': comment.length > 1000}">{{ comment.length }}/1000</div>
      <button v-if="props.closeActive" type="button" class="text-button text-button__secondary text-button__small" @click="closeField()">
        <span>Anuluj</span>
        <XMarkIcon class="button-icon"></XMarkIcon>
      </button>
      <button type="submit" class="text-button text-button__primary text-button__small add-button">
        <template v-if="!isFormPending">
          <span>Dodaj</span>
          <PaperAirplaneIcon class="button-icon"></PaperAirplaneIcon>
        </template>
        <div v-if="isFormPending" class="loader">
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
        </div>
      </button>
    </div>
  </form>
</template>

<style scoped lang="scss">
.write-comment {
  @apply w-full h-auto;

  &__top {
    @apply w-full h-auto flex items-start space-x-2;
  }

  &__avatar {
    @apply w-auto h-auto flex-shrink-0 flex flex-col items-center space-y-2;

    .avatar {
      @apply w-10 h-10 rounded-full overflow-hidden bg-zinc-900;
    }
  }

  &__content {
    @apply w-full h-auto relative;

    textarea {
      @apply w-full h-20 bg-zinc-900 rounded-md text-sm font-semibold resize-none border border-zinc-600 p-2 pr-12 pb-10;
    }

    .options {
      @apply absolute bottom-4 right-2 w-auto h-auto flex items-end space-x-2;

      .limit {
        @apply text-xs font-light text-zinc-400;
      }
    }
  }

  &__actions {
    @apply w-full h-auto flex items-center justify-end space-x-2 mb-2;

    .char-limit {
      @apply w-auto h-8 flex items-center justify-center p-2 text-xs bg-zinc-700 rounded-lg;

      &.alert {
        @apply text-red-500;
      }
    }

    .add-button {
      @apply min-w-[5rem];

      .loader {
        @apply space-x-1;
        .dot {
          @apply w-1.5 h-1.5;
        }
      }
    }
  }
}
</style>
