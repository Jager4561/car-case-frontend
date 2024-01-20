<script setup lang="ts">
import useVuelidate from '@vuelidate/core';
import { required, minLength, maxLength } from '@vuelidate/validators';
import { helpers } from '@vuelidate/validators';

const props = defineProps<{
  account: Account;
}>();
const { createWarningToast, createErrorToast, createSuccessToast } = useToasts();
const { updateUsername } = useAccount();
const isFormPending = ref(false);

const inputs = reactive({
  username: '',
});

const rules = {
  username: {
    required: helpers.withMessage('Musisz uzupelnić to pole.', required),
    minLength: helpers.withMessage('Nazwa użytkownika musi mieć co najmniej 3 znaki.', minLength(3)),
    maxLength: helpers.withMessage('Nazwa użytkownika musi mieć co najwyżej 32 znaki.', maxLength(32)),
  },
};

const form = useVuelidate(rules, inputs);

const submitForm = async () => {
  if(isFormPending.value) return;
  form.value.$validate();
  if (form.value.$invalid) {
    createWarningToast('Uwaga!', 'Popraw zaznaczone pola w formularzu.');
    return;
  }
  if(inputs.username === props.account.name) {
    createWarningToast('Zmiana nazwy użytkownika', 'Podana nazwa użytkownika jest taka sama jak obecna. Wybierz inną nazwę użytkownika.');
    return;
  }
  isFormPending.value = true;
  try {
    await updateUsername(inputs.username);
    createSuccessToast('Zmiana nazwy użytkownika', 'Nazwa użytkownika została zmieniona.');
  } catch (error: any) {
    switch(error.type) {
      case 'name_taken': {
        createErrorToast('Zmiana nazwy użytkownika', 'Podana nazwa użytkownika jest już zajęta. Wybierz inną nazwę użytkownika.');
        break;
      }
      default: {
        createErrorToast('Zmiana nazwy użytkownika', 'Wystąpił nieznany błąd. Spróbuj ponownie później.');
        break;
      }
    }
  } finally {
    isFormPending.value = false;
  }
}

onMounted(() => {
  inputs.username = props.account.name;
});
</script>

<template>
  <form class="username" @submit.prevent="submitForm()">
    <div class="username-input">
      <div class="input_container">
        <label for="username">Nazwa użytkownika</label>
        <input v-model="form.username.$model" type="username" id="username" name="username" placeholder="Jan Kowalski" />
        <div class="error" :class="{ visible: form.username.$error && form.$dirty }">
          <div class="error__container">
            <div class="error__content">
              <span v-for="error of form.username.$errors" :key="error.$uid">{{ error.$message }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="actions">
      <button type="submit" class="text-button text-button__medium text-button__primary">
        <span v-if="!isFormPending">Zmień nazwę</span>
        <div v-if="isFormPending" class="loader">
          <div class="dots"></div>
          <div class="dots"></div>
          <div class="dots"></div>
        </div>
      </button>
    </div>
  </form>
</template>

<style scoped lang="scss">
.username {
  @apply w-full h-auto flex flex-col items-start justify-between;
  @apply sm:flex-row sm:items-end;
  @apply lg:flex-col lg:items-start;
  @apply xl:flex-row xl:items-end;

  .username-input {
    @apply w-full mb-3;
    @apply sm:w-1/2 sm:-mb-3;
    @apply lg:w-full lg:mb-3;
    @apply xl:w-1/3 xl:-mb-3;
  }

  .input_container input {
    @apply w-full bg-zinc-900;
  }

  .actions {
    @apply w-full flex items-center justify-end;
    @apply sm:w-auto;
    @apply lg:w-full;
    @apply xl:w-auto;

    .text-button {
      @apply min-w-[8rem];

      .loader {
        @apply m-0;
      }
    }
  }
}
</style>
