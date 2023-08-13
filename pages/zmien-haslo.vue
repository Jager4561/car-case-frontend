<script setup lang="ts">
import { useVuelidate } from '@vuelidate/core';
import { required, minLength, sameAs } from '@vuelidate/validators';
import { helpers } from '@vuelidate/validators';

definePageMeta({
  layout: 'auth',
  middleware: [
    'auth-active',
  ],
});

useSeoMeta({
  title: 'Aktywuj konto',
});

const route = useRoute();
const { createErrorToast, createWarningToast } = useToasts();
const isFormPending = ref(false);
const stage = ref('loading');

const inputs = reactive({
  password: '',
  confirmPassword: '',
});

const rules = {
  password: {
    required: helpers.withMessage('Musisz uzupelnić to pole.', required),
    minLength: helpers.withMessage('Hasło musi mieć minimum 8 znaków.', minLength(8)),
    oneBigLetter: helpers.withMessage('Hasło musi zawierać przynajmniej jedną wielką literę.', helpers.regex(/^(?=.*[A-Z]).+$/)),
    oneNumber: helpers.withMessage('Hasło musi zawierać przynajmniej jedną cyfrę.', helpers.regex(/^(?=.*\d).+$/)),
    oneSpecialChar: helpers.withMessage('Hasło musi zawierać przynajmniej jeden znak specjalny.', helpers.regex(/^(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).+$/)),
  },
  confirmPassword: {
    required: helpers.withMessage('Musisz uzupelnić to pole.', required),
    sameAs: helpers.withMessage('Hasła nie są identyczne.', sameAs(computed(() => inputs.password))),
  },
};

const form = useVuelidate(rules, inputs);
const savedToken = ref('');

onMounted(() => {
  const token = route.query.token as string;
  if(token == null) {
    stage.value = 'error';
    return;
  }
  const expires = route.query.expires;
  if(expires == null) {
    stage.value = 'error';
    return;
  }
  if(new Date().getTime() > +expires) {
    stage.value = 'expired';
    return;
  }
  savedToken.value = token;
  stage.value = 'enter_password';
})

const onFormSubmit = async () => {
  form.value.$validate();
  if (form.value.$invalid) {
    createWarningToast('Uwaga!', 'Popraw zaznaczone pola w formularzu.');
    return;
  }
  isFormPending.value = true;
  try {
    const result = await changePassword({
      token: savedToken.value,
      password: inputs.password,
    });
    stage.value = 'success';
  } catch (error: any) {
    let message = 'Wystąpił nieznany błąd. Spróbuj ponownie później.';
    switch(error.type) {
      case 'payload': {
        message = 'Wystąpił błąd poczas przetwarzania danych formularza. Odśwież stronę i spróbuj ponownie.';
        break;
      }
      case 'not_found': {
        message = 'Nie znaleziono użytkownika o podanym adresie e-mail.';
        break;
      }
      case 'inactive': {
        message = 'Konto nie zostało jeszcze aktywowane. Sprawdź swoją skrzynkę pocztową.';
        break;
      }
      case 'invalid_password': {
        message = 'Podane hasło jest nieprawidłowe.';
        break;
      }
    }
    createErrorToast('Błąd rejestracji!', message);
  } finally {
    isFormPending.value = false;
  }
};
</script>

<template>
  <div class="login_container">
    <NuxtLink to="/" class="logo">
      <h3><span class="highlight">CAR</span>CASE</h3>
    </NuxtLink>
    <Transition name="fade" mode="out-in">
      <div v-if="stage === 'loading'">
        <h1 class="page_title">
          Prosimy czekać
          <div class="loading">
            <div></div>
            <div></div>
            <div></div>
          </div>
        </h1>
        <p class="description">Żądanie jest przetwarzane.</p>
      </div>
      <div v-else-if="stage === 'error'" class="stage">
        <h1 class="page_title error">Wystąpił błąd</h1>
        <p class="description">
          Wystąpił błąd podczas przetwarzania danych potrzebnych do zmiany hasła. Upewnij się, że użyłeś linku z wiadomości e-mail wysłanej na twoją skrzynkę e-mail.
        </p>
        <NuxtLink to="/" class="text-button text-button__secondary text-button__medium">
          Strona główna
        </NuxtLink>
      </div>
      <div v-else-if="stage === 'expired'" class="stage">
        <h1 class="page_title error">Prośba o zmianę hasła wygasła</h1>
        <p class="description">
          Wygląda na to, że od stworzenia prośby o zmianę hasła minęło zbyt dużo czasu. Prośba o zmianę hasła wygasa po 24 godzinach od jej stworzenia. Przejdź do strony odzyskiwania hasła i spróbuj ponownie.
        </p>
        <NuxtLink to="/reset-hasla" class="text-button text-button__primary text-button__medium">
          Poproś o zmianę hasła
        </NuxtLink>
        <NuxtLink to="/" class="text-button text-button__secondary text-button__medium">
          Strona główna
        </NuxtLink>
      </div>
      <div v-else-if="stage === 'enter_password'" class="stage">
        <h1 class="page_title">Zmień hasło</h1>
        <p class="description">Wprowadź nowe hasło do logowania na konto w serwisie.</p>
        <form class="login_form" @submit.prevent="onFormSubmit">
          <div class="input_container">
            <label for="password">Nowe hasło</label>
            <input v-model="form.password.$model" type="password" id="password" name="password" placeholder="••••••••" />
            <div class="error" :class="{ visible: form.password.$error && form.$dirty }">
              <div class="error__container">
                <div class="error__content">
                  <span v-for="error of form.password.$errors" :key="error.$uid">{{ error.$message }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="input_container">
            <label for="confirm_password">Powtórz hasło</label>
            <input v-model="form.confirmPassword.$model" type="password" id="confirm_password" name="confirm_password" placeholder="••••••••" />
            <div class="error" :class="{ visible: form.confirmPassword.$error && form.$dirty }">
              <div class="error__container">
                <div class="error__content">
                  <span v-for="error of form.confirmPassword.$errors" :key="error.$uid">{{ error.$message }}</span>
                </div>
              </div>
            </div>
          </div>
          <button type="submit" class="submit_button">
            <span v-if="!isFormPending">Zmień hasło</span>
            <div v-if="isFormPending" class="dots">
              <div></div>
              <div></div>
              <div></div>
            </div>
          </button>
        </form>
      </div>
      <div v-else-if="stage === 'success'" class="stage">
        <h1 class="page_title">Hasło zmienione pomyślnie</h1>
        <p class="description">Twoje hasło zostało zmienione, możesz się zalogować na konto.</p>
        <NuxtLink to="/zaloguj" class="text-button text-button__primary text-button__medium">
          Zaloguj się
        </NuxtLink>
      </div>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
.login_container {
  @apply w-full h-full flex flex-col items-start justify-center p-12 relative;
  @apply sm:p-16;

  .stage {
    @apply w-full h-auto;
  }

  .loading_mask {
    @apply absolute top-0 left-0 flex items-center justify-center w-full h-full bg-zinc-900 opacity-75 z-10;
  }

  .logo {
    @apply w-auto h-auto mb-4;

    h3 {
      @apply text-xl font-black leading-5;

      .highlight {
        @apply text-darkCyan;
      }
    }
  }

  .page_title {
    @apply w-full h-auto text-2xl font-normal leading-5 mb-4;

    .loading {
      @apply w-auto h-auto inline-flex align-middle items-center justify-center space-x-1.5 ml-2;

      div {
        @apply w-2 h-2 rounded-full bg-white;
        animation: fade 0.8s ease-in-out alternate infinite;
      }

      div:nth-of-type(1) {
        animation-delay: -0.4s;
      }

      div:nth-of-type(2) {
        animation-delay: -0.2s;
      }
    }
  }

  .page_title.error {
    @apply text-red-600;
  }

  .description {
    @apply text-sm font-light mb-4;
  }

  .text-button {
    @apply mb-2;
  }

  form {
    @apply w-full h-auto mb-6;

    .submit_button {
      @apply w-full h-10 flex items-center justify-center text-white bg-darkCyan rounded-md px-6 py-2 text-sm font-semibold duration-150 cursor-pointer;
      @apply hover:filter hover:brightness-110;

      .dots {
        @apply w-auto h-auto flex flex-nowrap items-center justify-center space-x-1.5;
      }

      .dots div {
        @apply w-3 h-3 rounded-full bg-white;
        animation: fade 0.8s ease-in-out alternate infinite;
      }

      .dots div:nth-of-type(1) {
        animation-delay: -0.4s;
      }

      .dots div:nth-of-type(2) {
        animation-delay: -0.2s;
      }

      @keyframes fade {
        from {
          opacity: 1;
        }
        to {
          opacity: 0;
        }
      }
    }
  }

  .spacer {
    @apply w-1/2 h-0.5 bg-zinc-700 rounded-md mx-auto mb-6;
  }

  .secondary_button {
    @apply w-full h-10 flex items-center justify-center text-white bg-zinc-700 rounded-md px-6 py-2 text-sm font-semibold duration-150 cursor-pointer mb-2;
    @apply hover:bg-zinc-600;
  }

  .secondary_button:last-child {
    @apply mb-0;
  }
}
</style>
