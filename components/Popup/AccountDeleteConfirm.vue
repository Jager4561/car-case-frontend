<script setup lang="ts">
import { XMarkIcon, ExclamationTriangleIcon } from '@heroicons/vue/24/solid';

const { hidePopup } = usePopups();
const { deleteAccount } = useAccount();
const { createErrorToast, createSuccessToast } = useToasts();
const { deleteSession } = useAuthState();
const postState = usePostsState();
const modelsState = useModelsState();
const filtersState = useFilters();
const accountState = useAccount();
const requestPending = ref(false);

const close = () => {
  hidePopup();
};

const confirmAccountDeletion = async () => {
  if (requestPending.value) return;
  requestPending.value = true;
  try {
    await deleteAccount();
    createSuccessToast('Usuwanie konta', 'Konto zostało usunięte.');
    postState.resetState();
    modelsState.resetState();
    filtersState.resetState();
    accountState.resetState();
    deleteSession();
    close();
    navigateTo('/');
  } catch(error) {
    createErrorToast('Usuwanie konta', 'Wystąpił błąd podczas usuwania konta. Spróbuj ponownie później.');
    console.error(error);
  } finally {
    requestPending.value = false;
  }
};
</script>

<template>
  <div class="comment-login-popup">
    <div class="header">
      <div class="title">
        <ExclamationTriangleIcon class="icon" />
        <span> Usunięcie konta </span>
      </div>
      <div class="header-actions">
        <button class="icon-button icon-button__medium icon-button__secondary" @click="close()">
          <XMarkIcon class="button-icon"></XMarkIcon>
        </button>
      </div>
    </div>
    <div class="content">
      <p>
        Usunięcie konta spowoduje, że stracisz dostęp do konta, nie będziesz mógł się zalogować, a stworzone przez Ciebie instrukcje oraz dodane komentarze pozostaną w serwisie, ale nie będziesz
        widoczny jako ich autor. Czy na pewno chcesz usunąć konto?
      </p>
    </div>
    <div class="actions">
      <button @click="close()" class="text-button text-button__secondary text-button__medium">Anuluj</button>
      <button @click="confirmAccountDeletion()" class="text-button text-button__danger text-button__medium">
        <span v-if="!requestPending">Usuń</span>
        <div v-if="requestPending" class="loader">
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
        </div>
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.comment-login-popup {
  @apply w-full max-w-lg h-auto bg-zinc-900 rounded-lg border border-zinc-600;

  .header {
    @apply w-full h-auto flex items-center justify-between p-4 border-b border-zinc-600;

    .title {
      @apply w-auto flex-shrink-0 flex items-center justify-start space-x-2 text-red-600 font-semibold;

      .icon {
        @apply w-10 h-10;
      }
    }
  }

  .content {
    @apply w-full h-auto p-4 text-sm;
  }

  .actions {
    @apply w-full h-auto flex items-center justify-end space-x-2 p-4;

    .text-button {
      @apply min-w-[5rem];
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
