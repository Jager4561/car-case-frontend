<script setup lang="ts">
import { XMarkIcon } from '@heroicons/vue/24/solid';

const props = defineProps<{
  options: {
    commentId: number;
  }
}>();

const { hidePopup } = usePopups();
const { createErrorToast, createWarningToast, createSuccessToast } = useToasts();
const { reportComment } = usePostsState();
const isFormPending = ref(false);
const reason = ref('');

const close = () => {
  hidePopup();
};

const sendReport = async () => {
  if (isFormPending.value) return;
  if(reason.value.length === 0) {
    createWarningToast('Zgłaszanie komentarza', 'Powód zgłoszenia nie może być pusty.');
    return;
  } 
  isFormPending.value = true;
  try {
    await reportComment(props.options.commentId, reason.value);
    createSuccessToast('Zgłaszanie komentarza', 'Komentarz został zgłoszony. Dziękujemy');
    close();
  } catch (error) { 
    createErrorToast('Zgłaszanie komentarza', 'Wystąpił błąd podczas zgłaszania komentarza. Spróbuj ponownie później.');
  } finally {
    isFormPending.value = false;
  }
};
</script>

<template>
  <form class="comment-login-popup" @submit.prevent="sendReport()">
    <div class="header">
      <div class="title">Zgłoś komentarz</div>
      <div class="header-actions">
        <button type="button" class="icon-button icon-button__medium icon-button__secondary" title="Zamknij" @click="close()">
          <XMarkIcon class="button-icon"></XMarkIcon>
        </button>
      </div>
    </div>
    <div class="content">
      <p class="description">Wpisz powód zgłoszenia komentarza np. (obrażanie innych użytkowników, wprowadzanie w błąd itp.)</p>
      <textarea v-model="reason"></textarea>
    </div>
    <div class="actions">
      <button type="submit" class="text-button text-button__primary text-button__medium">
        <span v-if="!isFormPending">Wyślij</span>
        <div v-if="isFormPending" class="loader">
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
        </div>
      </button>
      <button type="button" class="text-button text-button__secondary text-button__medium" @click="close()">Anuluj</button>
    </div>
  </form>
</template>

<style scoped lang="scss">
.comment-login-popup {
  @apply w-full max-w-lg h-auto bg-zinc-900 rounded-lg border border-zinc-600;

  .header {
    @apply w-full h-auto flex items-center justify-between p-4 border-b border-zinc-600;

    .title {
      @apply w-auto flex-shrink-0;
    }
  }

  .content {
    @apply w-full h-auto p-4;

    .description {
      @apply text-sm font-semibold mb-4;
    }

    textarea {
      @apply w-full h-32 rounded-md bg-zinc-800 border border-zinc-600 p-2 text-sm resize-none;
    }
  }

  .actions {
    @apply w-full h-auto flex items-center justify-end space-x-2 p-4;
    
    .text-button {
      @apply min-w-[5rem]
    }

    .loader {
      @apply space-x-1;

      .dot {
        @apply w-2 h-2;
      }
    }
  }
}
</style>
