<script setup lang="ts">
import { UserIcon, XMarkIcon } from '@heroicons/vue/24/solid';

const props = defineProps<{
  modelValue: string | null;
  accounts: {
    id: string;
    name: string;
    avatar: string | null;
  }[];
}>();
const search = ref<HTMLInputElement | null>(null);
const list = ref<HTMLDivElement | null>(null);

const emit = defineEmits(['update:modelValue']);

const listOpen = ref(false);
const selectedAccount = ref<{
  id: string;
  name: string;
  avatar: string | null;
} | null>(null);

onMounted(() => {
  search.value!.addEventListener('focus', () => {
    listOpen.value = true;
  });
  search.value!.addEventListener('blur', () => {
    listOpen.value = false;
  });
});

const setAccount = (account: any) => {
  emit('update:modelValue', account.id);
  selectedAccount.value = account;
  listOpen.value = false;
}

const clearInput = () => {
  emit('update:modelValue', null);
  selectedAccount.value = null;
  search.value!.value = '';
};
</script>

<template>
  <div class="account_input">
    <div class="field__input">
      <input ref="search" v-show="props.modelValue == null" type="text" placeholder="Szukaj konta..." />
      <div v-if="props.modelValue != null" class="selected">
        <div class="info">
          <div class="avatar">
            <Image :src="selectedAccount != null ? selectedAccount.avatar : null" alt="user" altClass="w-5 h-5 text-zinc-500" loaderClass="w-1 h-1 rounded-full bg-white mr-0.5"></Image>
          </div>
          <span>{{ selectedAccount?.name }}</span>
        </div>
        <button class="icon-button icon-button__secondary icon-button__small" @click="clearInput()">
          <XMarkIcon />
        </button>
      </div>
    </div>
    <Transition name="list">
      <div ref="list" v-show="listOpen" class="list">
        <button v-for="account in props.accounts" class="list__option" :class="{'list__selected': account.id == props.modelValue}" @click="setAccount(account)">
          <div class="avatar">
            <Image :src="account.avatar" alt="user" altClass="w-5 h-5 text-zinc-500" loaderClass="w-1 h-1 rounded-full bg-white mr-0.5"></Image>
          </div>
          <span>{{ account.name }}</span>
        </button>
      </div>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
.account_input {
  @apply relative;

  .selected {
    @apply w-full h-10 flex items-center justify-between p-1.5 text-sm text-left bg-zinc-800 rounded-lg;

    .info {
      @apply flex items-center space-x-2;

      .avatar {
        @apply w-6 h-6 rounded-full overflow-hidden bg-zinc-600 flex items-center justify-center flex-shrink-0;

        .no_avatar {
          @apply static w-3 h-3 text-zinc-300;
        }
      }
    }
  }

  .list {
    @apply w-full h-auto max-h-40 absolute top-full left-0 rounded-lg bg-zinc-800 border border-zinc-700 mt-1 overflow-y-auto z-10;
    transform-origin: top;

    &__option {
      @apply w-full h-auto px-2 py-1.5 text-sm text-left flex items-center space-x-2 duration-200 hover:bg-zinc-700;

      .avatar {
        @apply w-8 h-8 rounded-full overflow-hidden bg-zinc-600 flex items-center justify-center flex-shrink-0;

        .no_avatar {
          @apply w-4 h-4 text-zinc-300;
        }
      }
    }

    &__selected {
      @apply bg-zinc-700 font-bold;
    }
  }
}
</style>
