<script setup lang="ts">
import { IconArrowMoveUp, IconArrowMoveDown, IconTrash, IconPhoto } from '@tabler/icons-vue';

const props = defineProps<{
  index: number;
  isLast: boolean;
  data: {
    type: string;
    content: string;
    file?: File | null;
  };
}>();
const emit = defineEmits(['moveUp', 'moveDown', 'remove', 'update']);
const { createErrorToast } = useToasts();
const imageInput = ref<HTMLInputElement | null>(null);
const previewMode = ref<'file' | 'outside'>('outside');
const imagePreview = ref<string | null>(null);

const setNewImage = async () => {
  imageInput.value!.click();
};

const invokeMoveUp = () => {
  emit('moveUp', props.index);
};

const invokeMoveDown = () => {
  emit('moveDown', props.index);
};

const invokeRemove = () => {
  emit('remove', props.index);
};

const onImageSet = () => {
  if (imageInput.value && imageInput.value.files && imageInput.value.files?.length !== 1) {
    createErrorToast('Dodawanie zdjęcia', 'Wybrano więcej niż jedno zdjęcie lub nie wybrano żadnego zdjęcia. Spróbuj jeszcze raz.');
    return;
  }
  const file = imageInput.value!.files![0];
  imagePreview.value = URL.createObjectURL(file);
  previewMode.value = 'file';
  emit('update', {
    index: props.index,
    data: {
      type: 'image',
      content: props.data.content ? props.data.content : null,
      file,
    },
  });
};

const onPropsUpdate = () => {
  if(props.data.file) {
    imagePreview.value = URL.createObjectURL(props.data.file);
    previewMode.value = 'file';
    return;
  }
  if(props.data.content) {
    imagePreview.value = props.data.content;
    previewMode.value = 'outside';
    return;
  }
  imagePreview.value = null;
  return;
}

onMounted(() => {
  imageInput.value = document.createElement('input');
  imageInput.value.type = 'file';
  imageInput.value.accept = 'image/png, image/jpeg, image/webp, image/gif';
  imageInput.value.addEventListener('input', onImageSet);
  onPropsUpdate();
});

watch(props, () => {
  onPropsUpdate();
}, { deep: true, immediate: true });
</script>

<template>
  <div class="heading-section">
    <div class="header">
      <div class="name">Sekcja ze zdjęciem</div>
      <div class="actions">
        <button :disabled="props.index == 0" class="icon-button icon-button__small icon-button__secondary" title="Przenieś do góry" @click="invokeMoveUp()">
          <IconArrowMoveUp class="icon" />
        </button>
        <button :disabled="props.isLast" class="icon-button icon-button__small icon-button__secondary" title="Przenieś w dół" @click="invokeMoveDown()">
          <IconArrowMoveDown class="icon" />
        </button>
        <button class="icon-button icon-button__small icon-button__secondary" title="Usuń sekcję" @click="invokeRemove()">
          <IconTrash class="icon" />
        </button>
      </div>
    </div>
    <div class="content">
      <button v-if="imagePreview == null" class="select-image" @click="setNewImage()">
        <IconPhoto class="icon" />
        <span>Wybierz zdjęcie</span>
      </button>
      <div v-if="imagePreview != null" class="image-preview">
        <NuxtImg v-if="previewMode == 'file'" :src="(imagePreview as any)"></NuxtImg>
        <div v-if="previewMode == 'outside'" class="preview">
          <Image :src="props.data.content" alt="image"></Image>
        </div>
        <div class="actions">
          <button class="text-button text-button__medium text-button__secondary" @click="setNewImage()">
            <span>Zmień zdjęcie</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.heading-section {
  @apply w-full h-auto bg-zinc-900 rounded-md mb-3;

  .header {
    @apply w-full h-auto flex items-center justify-between px-2 py-1.5 border-b border-zinc-700;

    .name {
      @apply text-sm text-zinc-500;
    }

    .actions {
      @apply w-auto flex items-center justify-end;
    }
  }

  .content {
    @apply w-full h-auto relative;

    .select-image {
      @apply w-full h-auto flex flex-col items-center justify-center p-3 py-6 text-zinc-500 duration-200;
      @apply hover:text-darkCyan;

      .icon {
        @apply w-10 h-10 mb-2;
      }

      span {
        @apply text-sm;
      }
    }

    .image-preview {
      @apply w-full h-auto p-3 relative;

      img {
        @apply w-full max-w-screen-md h-auto aspect-video mx-auto object-center object-contain bg-zinc-950 overflow-hidden rounded-lg;
      }

      .preview {
        @apply w-full max-w-screen-md h-auto aspect-video mx-auto
      }

      .actions {
        @apply w-auto h-auto bottom-0 right-0 absolute flex items-center justify-end space-x-2 p-3;
      }
    }
  }
}
</style>
