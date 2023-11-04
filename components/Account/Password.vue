<script setup lang="ts">
import useVuelidate from '@vuelidate/core';
import { required, minLength, sameAs } from '@vuelidate/validators';
import { helpers } from '@vuelidate/validators';

const props = defineProps<{
  account: Account;
}>();

const inputs = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
});

const rules = {
  currentPassword: {
    required: helpers.withMessage('Musisz uzupelnić to pole.', required),
    minLength: helpers.withMessage('Hasło musi mieć minimum 8 znaków.', minLength(8)),
  },
  newPassword: {
    required: helpers.withMessage('Musisz uzupelnić to pole.', required),
    minLength: helpers.withMessage('Hasło musi mieć minimum 8 znaków.', minLength(8)),
    oneBigLetter: helpers.withMessage('Hasło musi zawierać przynajmniej jedną wielką literę.', helpers.regex(/^(?=.*[A-Z]).+$/)),
    oneNumber: helpers.withMessage('Hasło musi zawierać przynajmniej jedną cyfrę.', helpers.regex(/^(?=.*\d).+$/)),
    oneSpecialChar: helpers.withMessage('Hasło musi zawierać przynajmniej jeden znak specjalny.', helpers.regex(/^(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).+$/)),
  },
  confirmPassword: {
    required: helpers.withMessage('Musisz uzupelnić to pole.', required),
    sameAs: helpers.withMessage('Hasła nie są identyczne.', sameAs(computed(() => inputs.newPassword))),
  },
};

const form = useVuelidate(rules, inputs);

const { createErrorToast, createSuccessToast, createWarningToast } = useToasts();
const { changePassword } = useAccount();
const isFormPending = ref(false);

const onFormSubmit = async () => {
  if(isFormPending.value) return;
  form.value.$validate();
  if (form.value.$invalid) {
    createWarningToast('Uwaga!', 'Popraw zaznaczone pola w formularzu.');
    return;
  }
  const lastChange = props.account.last_password_change;
  if(lastChange != null && new Date(lastChange).getTime() < new Date().getTime()) {
    createErrorToast('Zmiana hasła', 'Nie możesz zmienić hasła ponownie przed upływem 24 godzin od ostatniej zmiany hasła.');
    return;
  }
  isFormPending.value = true;
  try {
    await changePassword({
      current_password: inputs.currentPassword,
      new_password: inputs.newPassword,
    });
    createSuccessToast('Zmiana hasła', 'Hasło zostało zmienione.');
    form.value.$reset();
  } catch (error: any) {
    console.error(error);
    switch(error.type) {
      case 'requirements_not_met': {
        createErrorToast('Zmiana hasła', 'Hasło nie spełnia wymagań bezpieczeństwa. Odśwież stronę i spróbuj ponownie.');
        break;
      }
      case 'invalid_password': {
        createErrorToast('Zmiana hasła', 'Podane obecne hasło jest nieprawidłowe.');
        break;
      }
      default: {
        createErrorToast('Zmiana hasła', 'Wystąpił nieznany błąd. Spróbuj ponownie później.');
        break;
      }
    }
  } finally {
    isFormPending.value = false;
  }
}
</script>

<template>
  <form class="password-change" @submit.prevent="onFormSubmit()">
    <div class="password-input">
      <div class="input_container">
        <label for="currentPassword">Obecne hasło</label>
        <input v-model="form.currentPassword.$model" type="password" id="currentPassword" name="password" placeholder="••••••••" />
        <div class="error" :class="{ visible: form.currentPassword.$error && form.$dirty }">
          <div class="error__container">
            <div class="error__content">
              <span v-for="error of form.currentPassword.$errors" :key="error.$uid">{{ error.$message }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="password-input">
      <div class="input_container">
        <label for="newPassword">Nowe hasło</label>
        <input v-model="form.newPassword.$model" type="password" id="newPassword" name="newPassword" placeholder="••••••••" />
        <div class="error" :class="{ visible: form.newPassword.$error && form.$dirty }">
          <div class="error__container">
            <div class="error__content">
              <span v-for="error of form.newPassword.$errors" :key="error.$uid">{{ error.$message }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="password-input"></div>
    <div class="password-input">
      <div class="input_container">
        <label for="confirmPassword">Powtórz nowe hasło</label>
        <input v-model="form.confirmPassword.$model" type="password" id="confirmPassword" name="confirmPassword" placeholder="••••••••" />
        <div class="error" :class="{ visible: form.confirmPassword.$error && form.$dirty }">
          <div class="error__container">
            <div class="error__content">
              <span v-for="error of form.confirmPassword.$errors" :key="error.$uid">{{ error.$message }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="actions">
      <button class="text-button text-button__medium text-button__primary">
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
.password-change {
  @apply w-auto h-auto gap-x-3;
  @apply sm:grid sm:grid-cols-2;
  @apply lg:block;
  @apply xl:grid xl:grid-cols-2;

  .input_container input {
    @apply w-full bg-zinc-900;
  }

  .actions {
    @apply flex justify-end col-span-2;

    .text-button {
      @apply min-w-[8rem];

      .loader {
        @apply m-0;
      }
    }
  }
}
</style>
