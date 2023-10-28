<script setup lang="ts">
  import { IconCar, IconPhotoOff, IconCards, IconHelpHexagon, IconUserCircle } from '@tabler/icons-vue';

  const runtimeConfig = useRuntimeConfig();

  const componentStatus = ref<'loading' | 'error' | 'loaded'>('loading');
  const containerRef = ref<HTMLElement | null>(null);
  const props = withDefaults(
    defineProps<{
      src: string | null;
      alt?: string;
      altClass?: string;
      loaderClass?: string;
      mode?: 'contain' | 'cover';
      fit?: string;
    }>(),
    {
      src: null,
      alt: '',
      altClass: 'w-1/3 h-1/3 text-zinc-600',
      loaderClass: 'w-2 h-2 rounded-full bg-white mr-1',
      mode: 'cover',
      fit: 'outside',
    }
  );
  
  const parsedSrc = ref<string | null>(null);

  const loadImage = () => {
    if(props.src === null) {
        componentStatus.value = 'error';
        return;
      }
      let width = null;
      let height = null;
      if(containerRef.value) {
        width = containerRef.value.offsetWidth;
        height = containerRef.value.offsetHeight;
      }
      const image = new Image();
      let src = null;
      if(width !== null && height !== null && width !== 0 && height !== 0) {
        src = `${props.src}?width=${width}&height=${height}&fit=${props.fit}`;
      } else {
        src = `${props.src}?fit=${props.fit}`;
      }
      parsedSrc.value = src;
      image.src = `${runtimeConfig.public.assetsUrl}/assets/` + src;
      image.onload = () => {
        componentStatus.value = 'loaded';
      };
      image.onerror = () => {
        componentStatus.value = 'error';
      };
  }

  const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  onMounted(async () => {
    let emergencyBrake = false;
    let width = null;
    setTimeout(() => {
      emergencyBrake = true;
    }, 5000);
    while(emergencyBrake === false && (width == 0 || width == null)) {
      await wait(50);
      if(containerRef.value) {
        width = containerRef.value.offsetWidth;
      }
    }
    loadImage();
  });

  onUpdated(() => {
    loadImage();
  });
</script>

<template>
  <div ref="containerRef" class="image-container">
    <Transition name="fade" mode="out-in">
      <div v-if="componentStatus === 'loading'" class="image-loader">
        <div :class="props.loaderClass"></div>
        <div :class="props.loaderClass"></div>
        <div :class="props.loaderClass"></div>
      </div>
      <div v-else-if="componentStatus === 'loaded'" class="image">
        <NuxtImg
          :src="(parsedSrc as string)"
          provider="directus"
          :class="props.mode === 'contain' ? 'contain' : ''"
        ></NuxtImg>
      </div>
      <div v-else class="error">
        <IconCar v-if="props.alt === 'car'" :class="altClass" />
        <IconUserCircle v-else-if="props.alt === 'user'" :class="altClass" />
        <IconHelpHexagon v-else-if="props.alt === 'unknown'" :class="altClass" />
        <IconCards v-else-if="props.alt === 'brand'" :class="altClass" />
        <IconPhotoOff v-else :class="altClass" />
      </div>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
  .image-container {
    @apply w-full h-full;

    .image-loader {
      @apply w-full h-full flex items-center justify-center;

      div {
        animation: fade 0.8s ease-in-out alternate infinite;
      }

      div:nth-of-type(1) {
        animation-delay: -0.4s;
      }

      div:nth-of-type(2) {
        animation-delay: -0.2s;
      }

      div:last-of-type {
        margin-right: 0;
      }
    }

    .image {
      @apply w-full h-full;

      img {
        @apply w-full h-full object-cover object-center;
      }

      .img.contain {
        @apply object-contain object-center;
      }
    }

    .error {
      @apply w-full h-full flex items-center justify-center;
    }
  }
</style>