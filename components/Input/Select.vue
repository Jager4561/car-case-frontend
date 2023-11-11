<script setup lang="ts">
import { ChevronDownIcon } from '@heroicons/vue/24/solid';

const props = withDefaults(
  defineProps<{
    modelValue: string | number | null;
    clearVisible?: boolean;
    placeholder?: string;
    disabled?: boolean;
    options?: {
      value: string | number;
      label: string;
    }[];
  }>(),
  {
    clearVisible: true,
    placeholder: 'Wybierz',
    disabled: false,
    options: [] as any,
  }
);
const emit = defineEmits(['update:modelValue', 'onUpdate']);

const listOpen = ref(false);
const select = ref<HTMLDivElement | null>(null);
const list = ref<HTMLDivElement | null>(null);

onMounted(() => {
  window.addEventListener('click', isClickedOutside);
});

const selectedValue = computed(() => {
  if (props.options == undefined) return null;
  const wanted = props.options.find((option) => option.value === props.modelValue);
  if (wanted) {
    return wanted.label;
  } else {
    return props.modelValue;
  }
});

const selectValue = (value: string | number | null) => {
  emit('update:modelValue', value);
  emit('onUpdate', value);
  listOpen.value = false;
};

const toggleList = () => {
  listOpen.value = !listOpen.value;
};

const isClickedOutside = (event: MouseEvent) => {
  if (listOpen.value && select.value && list.value) {
    if (!select.value.contains(event.target as Node) && !list.value.contains(event.target as Node) && event.target !== select.value && event.target !== list.value) {
      listOpen.value = false;
    }
  }
};
</script>

<template>
  <div class="select_input">
    <div ref="select" tabindex="0" class="field__input field__with-icon" @click="toggleList()" :class="{disabled: props.disabled}">
      <div class="inputlike">
        <span v-if="!props.modelValue" class="placeholder">{{ props.placeholder }}</span>
        <div v-if="props.modelValue" class="value">{{ selectedValue }}</div>
      </div>
      <ChevronDownIcon :class="{ rotated: listOpen }" />
    </div>
    <Transition name="list">
      <div ref="list" v-show="listOpen" class="list">
        <button v-if="props.modelValue != null && props.clearVisible" class="list__option none" @click="selectValue(null)">{{ props.placeholder }}</button>
        <button v-for="option in props.options" class="list__option" :class="{ list__selected: option.value == props.modelValue }" @click="selectValue(option.value)">{{ option.label }}</button>
      </div>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
.select_input {
  @apply w-full h-auto relative;

  .field__input {
    @apply cursor-pointer ;

    .inputlike {
      @apply border-2 border-zinc-800;
    }

    svg {
      @apply duration-200;
    }

    .rotated {
      @apply transform rotate-180;
    }
  }

  .field__input.disabled {
    @apply pointer-events-none;

    .inputlike {
      @apply bg-zinc-900 border-2 border-zinc-800;
    }

    svg {
      @apply text-zinc-600;
    }

    .placeholder {
      @apply text-zinc-600;
    }

    .value {
      @apply text-zinc-400;
    }
  }

  .list {
    @apply w-full h-auto max-h-40 absolute top-full left-0 rounded-lg bg-zinc-800 border border-zinc-700 mt-1 overflow-y-auto z-10;
    transform-origin: top;

    &__option {
      @apply w-full h-auto px-2 py-1.5 text-sm text-left duration-200 hover:bg-zinc-700;

      &.none {
        @apply font-light text-zinc-500;
      }
    }

    &__selected {
      @apply bg-zinc-700 font-bold;
    }
  }
}
</style>
