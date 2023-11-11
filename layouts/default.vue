<script setup lang="ts">
import LoginToComment from '@/components/Popup/LoginToComment.vue';
import ReportComment from '@/components/Popup/ReportComment.vue';
import ReportPost from '@/components/Popup/ReportPost.vue';
import AccountDeleteConfirm from '@/components/Popup/AccountDeleteConfirm.vue';
import DeletePostConfirm from '@/components/Popup/DeletePostConfirm.vue';
import UnsavedChanges from '@/components/Popup/UnsavedChanges.vue';
import { Subscription } from 'rxjs';

const { popupListener, hidePopup } = usePopups();
const popupBody = ref<HTMLDivElement | null>(null);

const popupSubscription = ref<Subscription | null>(null);
const ignore = ref(true);
const popupVisible = ref(false);

const popupsMap: any = {
  loginToComment: LoginToComment,
  reportComment: ReportComment,
  reportPost: ReportPost,
  accountDeleteConfirm: AccountDeleteConfirm,
  deletePostConfirm: DeletePostConfirm,
  unsavedChanges: UnsavedChanges,
};
const popupComponent = ref<string | null>(null);
const popupOptions = ref<any>(null);

const closePopup = () => {
  hidePopup();
};

onMounted(() => {
  popupSubscription.value = popupListener().subscribe((value) => {
    /* if (value == null && ignore.value) {
      setTimeout(() => {
        ignore.value = false;
      }, 50);
      return;
    }
    if (value == null) {
      ignore.value = true;
    } */
    if(value && value.name != null) {
      popupComponent.value = value!.name;
    }
    if(value && value.options != null) {
      popupOptions.value = value!.options;
    } else {
      popupOptions.value = null;
    }
    popupVisible.value = !!value;
  });
});
</script>

<template>
  <div class="layout_container">
    <HeaderBar />
    <main class="content_container">
      <slot></slot>
    </main>
    <Teleport to="body">
      <Transition name="popup">
        <div v-if="popupVisible && popupComponent != null" class="popup">
          <div class="popup__backdrop" @click="closePopup()"></div>
          <div ref="popupBody" class="popup__wrapper">
            <component :is="popupsMap[popupComponent]" :options="popupOptions"></component>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped lang="scss">
.layout_container {
  @apply w-full h-auto;

  .content_container {
    @apply w-full h-auto mx-auto flex items-start;
    padding-top: theme('spacing.20');
  }
}

.popup {
  @apply fixed w-full h-full top-0 left-0 flex items-center justify-center bg-zinc-900 bg-opacity-50 p-3 z-[100];

  &__backdrop {
    @apply absolute w-full h-full top-0 left-0 z-[210];
  }

  &__wrapper {
    @apply w-auto h-auto bg-zinc-900 rounded-lg shadow-md shadow-zinc-800 relative z-[220];
  }
}
</style>
