<script setup lang="ts">
import { IconArrowMoveUp, IconArrowMoveDown, IconTrash, IconTextIncrease, IconTextDecrease } from '@tabler/icons-vue';

const props = defineProps<{
  index: number;
  isLast: boolean;
  data?: {
    type: string;
    size: number;
    content: string;
  };
}>();
const emit = defineEmits(['moveUp', 'moveDown', 'remove', 'update']);
const content = ref('');
const availableSizes = ref([12, 16, 20, 24, 28, 32, 36, 40]);
const currentSize = ref(1);

const lineHeight = computed(() => {
  switch(currentSize.value) {
    case 0:
      return '1rem';
    case 1:
      return '1.25rem';
    case 2:
      return '1.5rem';
    case 3:
      return '1.75rem';
    case 4:
      return '2rem';
    case 5:
      return '2.25rem';
    case 6:
      return '2.5rem';
    case 7:
      return '2.75rem';
    default:
      return '1.25rem';
  }
});

const increaseFontSize = () => {
  if (currentSize.value < availableSizes.value.length - 1) {
    currentSize.value++;
  }
};

const decreaseFontSize = () => {
  if (currentSize.value > 0) {
    currentSize.value--;
  }
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

onMounted(() => {
  if (props.data) {
    content.value = props.data.content;
    currentSize.value = props.data.size
  }
});

watch(currentSize, () => {
  emit('update', {
    index: props.index,
    data: {
      type: 'text',
      size: currentSize.value,
      content: content.value,
    },
  });
});

watch(content, () => {
  emit('update', {
    index: props.index,
    data: {
      type: 'text',
      size: currentSize.value,
      content: content.value,
    },
  });
});
</script>

<template>
  <div class="heading-section">
    <div class="header">
      <div class="name">Sekcja tekstowa</div>
      <div class="actions">
        <button :disabled="currentSize >= availableSizes.length - 1" class="icon-button icon-button__small icon-button__secondary" title="Powiększ tekst" @click="increaseFontSize()">
          <IconTextIncrease class="icon" />
        </button>
        <button :disabled="currentSize <= 0" class="icon-button icon-button__small icon-button__secondary" title="Zmniejsz tekst" @click="decreaseFontSize()">
          <IconTextDecrease class="icon" />
        </button>
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
      <div class="field">
        <div class="field__input">
          <textarea v-model="content" placeholder="Wprowadź treść..." :style="{ fontSize: availableSizes[currentSize] + 'px', lineHeight: lineHeight }"></textarea>
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
    @apply w-full h-auto p-3;

    textarea {
      @apply h-40;
    }
  }
}
</style>
