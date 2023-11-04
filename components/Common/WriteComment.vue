<script setup lang="ts">
import { PaperAirplaneIcon, XMarkIcon } from '@heroicons/vue/24/solid';

const props = withDefaults(
  defineProps<{
    postId: number,
    parentId?: number,
    closeActive?: boolean,
  }>(),
  {
    closeActive: true
  }
);
const emit = defineEmits(['closeClicked']);

const comment = ref('');

const closeField = () => {
  emit('closeClicked');
};

onMounted(() => {
  console.log(props);
})
</script>

<template>
  <div class="write-comment">
    <div class="write-comment__top">
      <div class="write-comment__avatar">
        <NuxtImg class="avatar" src="img/revenant.png"></NuxtImg>
      </div>
      <div class="write-comment__content">
        <textarea v-model="comment"></textarea>
      </div>
    </div>
    <div class="write-comment__actions">
      <div class="char-limit" :class="{'alert': comment.length > 500}">{{ comment.length }}/500</div>
      <button v-if="props.closeActive" class="text-button text-button__secondary text-button__small" @click="closeField()">
        <span>Anuluj</span>
        <XMarkIcon class="button-icon"></XMarkIcon>
      </button>
      <button class="text-button text-button__primary text-button__small">
        <span>Dodaj</span>
        <PaperAirplaneIcon class="button-icon"></PaperAirplaneIcon>
      </button>
    </div>
  </div>
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
      @apply w-10 h-10 object-center object-cover rounded-full;
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
  }
}
</style>
