<script setup lang="ts">
const mobileView = ref<'content' | 'vehicle' | 'info'>('content');
const isDesktop = ref(false);

const loadPost = async () => {};

const onResize = () => {
  isDesktop.value = window.innerWidth >= 1024;
};

onMounted(() => {
  loadPost();
  window.addEventListener('resize', onResize);
  onResize();
});
</script>

<template>
  <div class="page_container">
    <Transition name="drawer-left">
      <div class="page_container__vehicle-info">
        <div ref="vehicleInfoRef" class="page_container__vehicle-info__wrapper drawer__wrapper">
          <PostVehicleInfo />
        </div>
      </div>
    </Transition>
    <article class="content">

    </article>
    <Transition name="drawer-right">
      <aside v-show="mobileView === 'info' || isDesktop" class="right_bar">
        <div ref="infoRef" class="right_bar__wrapper drawer__wrapper">
          <RightSideBar />
        </div>
      </aside>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
.page_container {
  @apply w-full h-auto flex items-start pb-[72px];
  @apply lg:pb-0;

  &__vehicle-info {
    @apply fixed bottom-[72px] left-0 bg-zinc-900 bg-opacity-50 w-full h-full z-20;
    height: calc(100vh - theme('spacing.20') - 72px);
    @apply lg:sticky lg:top-20 lg:left-0 lg:border-r lg:border-r-zinc-700 lg:max-w-xs;

    @screen lg {
      height: calc(100vh - theme('spacing.20'));
    }

    &__wrapper {
      @apply w-full h-full flex justify-start bg-zinc-900;
      @apply sm:max-w-sm;
      @apply lg:max-w-full;
    }
  }

  .content {
    @apply w-full h-auto p-4;
    @apply lg:p-6;
  }

  .right_bar {
    @apply fixed bottom-[72px] right-0 bg-zinc-900 bg-opacity-50 w-full h-full flex justify-end;
    height: calc(100vh - theme('spacing.20') - 72px);
    @apply lg:sticky lg:top-20 lg:bottom-auto lg:bg-transparent lg:max-w-xs;
    @screen lg {
      height: calc(100vh - theme('spacing.20'));
    }

    &__wrapper {
      @apply w-full h-full flex justify-end bg-zinc-800;
      @apply sm:max-w-sm;
      @apply lg:max-w-full;
    }
  }

  .footer {
    @apply fixed bottom-0 left-0 w-full h-[72px] bg-zinc-900 flex items-center justify-between border-t border-t-zinc-700 px-4 py-3 z-40;
    @apply lg:hidden;
  }
}
</style>
