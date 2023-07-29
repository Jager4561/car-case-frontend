<script setup lang="ts">
import { ChevronDownIcon } from '@heroicons/vue/24/solid';

const props = defineProps<{
  modelValue: string | null;
  placeholder: string;
  options: {
    value: string;
    label: string;
  }[];
}>();
const emit = defineEmits(['update:modelValue']);

const listOpen = ref(false);
const select = ref<HTMLDivElement | null>(null);
const list = ref<HTMLDivElement | null>(null);

onMounted(() => {
  window.addEventListener('click', isClickedOutside);
});

const selectedValue = computed(() => {
  if(props.options == undefined) return null;
  const wanted = props.options.find((option) => option.value === props.modelValue);
  if(wanted) {
    return wanted.label;
  } else {
    return props.modelValue;
  }
})


const selectValue = (value: string) => {
  emit('update:modelValue', value);
  listOpen.value = false;
};

const toggleList = () => {
  listOpen.value = !listOpen.value;
};

const isClickedOutside = (event: MouseEvent) => {
  if (listOpen.value && select.value && list.value) {
    if (
      !select.value.contains(event.target as Node) &&
      !list.value.contains(event.target as Node) &&
      event.target !== select.value &&
      event.target !== list.value
    ) {
      listOpen.value = false;
    }
  }
};
</script>

<template>
  <div class="select_input">
    <div ref="select" tabindex="0" class="field__input field__with-icon" @click="toggleList()">
      <div class="inputlike">
        <span v-if="!props.modelValue" class="placeholder">{{ props.placeholder }}</span>
        <div v-if="props.modelValue" class="value">{{ selectedValue }}</div>
      </div>
      <ChevronDownIcon :class="{ rotated: listOpen }" />
    </div>
    <Transition name="list">
      <div ref="list" v-show="listOpen" class="list">
        <button v-for="option in props.options" class="list__option" :class="{list__selected: option.value == props.modelValue}" @click="selectValue(option.value)">{{ option.label }}</button>
      </div>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
.select_input {
  @apply w-full h-auto relative;

  .field__input {
    @apply cursor-pointer;

    svg {
      @apply duration-200;
    }

    .rotated {
      @apply transform rotate-180;
    }
  }

  .list {
    @apply w-full h-auto max-h-40 absolute top-full left-0 rounded-lg bg-zinc-800 border border-zinc-700 mt-1 overflow-y-auto z-10;
    transform-origin: top;

    &__option {
      @apply w-full h-auto px-2 py-1.5 text-sm text-left duration-200 hover:bg-zinc-700;
    }

    &__selected {
      @apply bg-zinc-700 font-bold;
    }
  }
}

.list-enter-active,
.list-leave-active {
  transition: all 0.2s ease;
}

.list-enter-from,
.list-leave-to {
  transform: scale(0.8) translateY(-10px);
  opacity: 0;
}
</style>
