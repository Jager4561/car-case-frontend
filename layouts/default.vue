<script setup lang="ts">
import LoginToComment from '@/components/Popup/LoginToComment.vue';
import { Subscription } from 'rxjs';

const { popupListener, hidePopup } = usePopups();
const popupBody = ref<HTMLDivElement | null>(null);

const popupSubscription = ref<Subscription | null>(null);
const ignore = ref(true);
const popupVisible = ref(false);

const popupsMap: any = {
  loginToComment: LoginToComment,
};
const popupComponent = ref<string | null>(null);

const onWindowClicked = (event: MouseEvent) => {
  if (!popupVisible.value) return;
  const isTarget = popupBody.value === event.target;
  const clickedInside = popupBody.value?.contains(event.target as Node);

  if (!isTarget && !clickedInside) {
    hidePopup();
  }
};

onMounted(() => {
  popupSubscription.value = popupListener().subscribe((value) => {
    if (value == null && ignore.value) {
      setTimeout(() => {
        ignore.value = false;
      }, 50);
      return;
    }
    if (value == null) {
      ignore.value = true;
    }
    popupComponent.value = value;
    popupVisible.value = !!value;
  });
  document.addEventListener('click', onWindowClicked);
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
          <div ref="popupBody" class="popup__wrapper">
            <component :is="popupsMap[popupComponent]"></component>
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
  @apply fixed w-full h-full top-0 left-0 flex items-center justify-center z-[200] bg-zinc-900 bg-opacity-50;

  &__wrapper {
    @apply w-auto h-auto bg-zinc-900 rounded-lg shadow-md shadow-zinc-800;
  }
}
</style>
