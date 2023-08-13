<script setup lang="ts">
import { useVuelidate } from '@vuelidate/core';
import { required, email, sameAs, minLength } from '@vuelidate/validators';
import { helpers } from '@vuelidate/validators';

definePageMeta({
  layout: 'auth',
  middleware: [
    'auth-active',
  ],
});

useSeoMeta({
  title: 'Zarejestruj się',
})

const isFormPending = ref(false);
const stage = ref('enter_data');
const { createWarningToast, createErrorToast } = useToasts();
const savedEmail = ref('');
const resendPending = ref(false);
const resendSuccess = ref(false);

const inputs = reactive({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
});

const rules = {
  name: {
    required: helpers.withMessage('Musisz uzupelnić to pole.', required),
  },
  email: {
    required: helpers.withMessage('Musisz uzupelnić to pole.', required),
    email: helpers.withMessage('Niepoprawny format adresu e-mail.', email),
  },
  password: {
    required: helpers.withMessage('Musisz uzupelnić to pole.', required),
    minLength: helpers.withMessage('Hasło musi mieć minimum 8 znaków.', minLength(8)),
    oneBigLetter: helpers.withMessage('Hasło musi zawierać przynajmniej jedną wielką literę.', helpers.regex(/^(?=.*[A-Z]).+$/)),
    oneNumber: helpers.withMessage('Hasło musi zawierać przynajmniej jedną cyfrę.', helpers.regex(/^(?=.*\d).+$/)),
    oneSpecialChar: helpers.withMessage('Hasło musi zawierać przynajmniej jeden znak specjalny.', helpers.regex(/^(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).+$/)),
  },
  password_confirmation: {
    required: helpers.withMessage('Musisz uzupelnić to pole.', required),
    sameAs: helpers.withMessage('Hasła nie są identyczne.', sameAs(computed(() => inputs.password))),
  },
};

const form = useVuelidate(rules, inputs);

const onFormSubmit = async () => {
  form.value.$validate();
  if (form.value.$invalid) {
    createWarningToast('Uwaga!', 'Popraw zaznaczone pola w formularzu.');
    return;
  }
  try {
    isFormPending.value = true;
    const result = await registerUser({
      name: inputs.name,
      email: inputs.email,
      password: inputs.password,
    });
    stage.value = 'done';
    savedEmail.value = inputs.email;
    isFormPending.value = false;
  } catch (error: any) {
    isFormPending.value = false;
    let message = 'Wystąpił nieznany błąd. Spróbuj ponownie później.';
    switch(error.type) {
      case 'payload': {
        message = 'Wystąpił błąd poczas przetwarzania danych formularza. Odśwież stronę i spróbuj ponownie.';
        break;
      }
      case 'email_taken': {
        message = 'Podany adres e-mail jest już zajęty.';
        break;
      }
    }
    createErrorToast('Błąd rejestracji!', message);
  }
};

const resendEmail = async () => {
  if(resendPending.value) return;
  if(savedEmail.value == null || savedEmail.value.length === 0) {
    createErrorToast('Błąd!', 'Ponowne wysłanie wiadomości e-mail jest w tej chwili niemożliwe. Skontaktuj się z obsługą.');
    return;
  }
  resendPending.value = true;
  try {
    const result = await resendActivationEmail(savedEmail.value);
    resendPending.value = false;
    resendSuccess.value = true;
  } catch (error) {
    resendPending.value = false;
    createErrorToast('Błąd!', 'Ponowne wysłanie wiadomości e-mail nie powiodło się, spróbuj ponownie później.');
  }
}
</script>

<template>
  <div class="login_container">
    <NuxtLink to="/" class="logo">
      <div class="go_back">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75" />
        </svg>
        <span>Główna</span>
      </div>
    </NuxtLink>
    <NuxtLink to="/" class="logo">
      <h3><span class="highlight">CAR</span>CASE</h3>
    </NuxtLink>
    <Transition name="fade" mode="out-in">
      <div class="enter_data" v-if="stage === 'enter_data'">
        <h1 class="page_title">Stwórz konto</h1>
        <p class="description">Wypełnij poniższy formularz i ciesz się dostępem do całej naszej dokumentacji.</p>
        <form class="login_form" @submit.prevent="onFormSubmit">
          <div class="inputs">
            <div class="input_container">
              <label for="name">Nazwa konta</label>
              <input v-model="form.name.$model" type="name" id="name" name="name" placeholder="Jan Kowalski" />
              <div class="error" :class="{ visible: form.name.$error && form.$dirty }">
                <div class="error__container">
                  <div class="error__content">
                    <span v-for="error of form.name.$errors" :key="error.$uid">{{ error.$message }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="input_container">
              <label for="email">Adres e-mail</label>
              <input v-model="form.email.$model" type="email" id="email" name="email" placeholder="nazwa@domena.pl" />
              <div class="error" :class="{ visible: form.email.$error && form.$dirty }">
                <div class="error__container">
                  <div class="error__content">
                    <span v-for="error of form.email.$errors" :key="error.$uid">{{ error.$message }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="input_container">
              <label for="password">Hasło</label>
              <input v-model="form.password.$model" type="password" id="password" name="password" placeholder="••••••••" />
              <div class="error" :class="{ visible: form.password.$error && form.$dirty }">
                <div class="error__container">
                  <div class="error__content">
                    <span v-for="error of form.password.$errors" :key="error.$uid">{{ error.$message }}<br /></span>
                  </div>
                </div>
              </div>
            </div>
            <div class="input_container">
              <label for="password_confirmation">Powtórz hasło</label>
              <input v-model="form.password_confirmation.$model" type="password" id="password_confirmation" name="password_confirmation" placeholder="••••••••" />
              <div class="error" :class="{ visible: form.password_confirmation.$error && form.$dirty }">
                <div class="error__container">
                  <div class="error__content">
                    <span v-for="error of form.password_confirmation.$errors" :key="error.$uid">{{ error.$message }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="actions">
            <NuxtLink to="/zaloguj" class="secondary_button">
              <span>Mam już konto</span>
            </NuxtLink>
            <button type="submit" class="submit_button">
              <span v-if="!isFormPending">Stwórz</span>
              <div v-if="isFormPending" class="dots">
                <div></div>
                <div></div>
                <div></div>
              </div>
            </button>
          </div>
        </form>
      </div>
      <div v-else-if="stage === 'done'">
        <h1 class="page_title">Konto zostało utworzone.</h1>
        <p class="description">Na skrzynkę twojej poczty e-mail wysłaliśmy wiadomość z linkiem aktywacyjnym. Po aktywacji konta będziesz mógł się zalogować.</p>
        <NuxtLink to="/zaloguj" class="login-button text-button text-button__medium text-button__primary">Zaloguj się</NuxtLink>
        <Transition name="fade" mode="out-in">
          <p v-if="!resendSuccess" class="resend">
            Jeżeli nie otrzymałeś wiadomości z linkiem aktywacyjnym możesz spróbować <a class="highlight" @click="resendEmail()">wysłać ją ponownie.</a> 
            <div v-if="resendPending" class="loading">
              <div></div>
              <div></div>
              <div></div>
            </div>
          </p>
          <p v-else class="resend-success">
            Wiadomość została wysłana ponownie.
          </p>
        </Transition>
      </div>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
.login_container {
  @apply w-full h-full flex flex-col items-start justify-center p-12 relative;
  @apply sm:p-16;

  .loading_mask {
    @apply absolute top-0 left-0 flex items-center justify-center w-full h-full bg-zinc-900 opacity-75 z-10;
  }

  .logo {
    @apply w-full h-auto mb-4;

    .go_back {
      @apply w-auto h-auto flex items-center space-x-1 duration-150;
      @apply hover:text-darkCyan;

      svg {
        @apply w-4 h-4 mb-0.5;
      }

      span {
        @apply text-sm font-medium leading-3;
      }
    }

    h3 {
      @apply text-xl font-black leading-5;

      .highlight {
        @apply text-darkCyan;
      }
    }
  }
  .enter_data {
    @apply w-full h-auto;
  }

  .page_title {
    @apply w-full h-auto text-2xl font-normal leading-5 mb-4;
  }

  .description {
    @apply text-sm font-light mb-4;
  }

  .login-button {
    @apply w-full mb-4;
  }

  .resend {
    @apply text-sm font-light;

    .highlight {
      @apply text-darkCyan font-bold cursor-pointer;
    }

    .loading {
      @apply w-auto h-auto inline-flex items-center justify-center space-x-1.5 ml-2;

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

  .resend-success {
    @apply text-sm font-light text-white;
    text-shadow: white 1px 0 10px;
  }

  form {
    @apply w-full h-auto;

    .inputs {
      @apply w-full h-auto mb-8;
    }

    .actions {
      @apply w-full h-auto flex items-center justify-end space-x-2;

      .secondary_button {
        @apply w-auto h-10 flex items-center justify-center text-white bg-zinc-700 rounded-md px-6 py-2 text-sm font-semibold duration-150 cursor-pointer;
        @apply hover:bg-zinc-600;
      }

      .submit_button {
        @apply w-auto h-10 flex items-center justify-center text-white bg-darkCyan rounded-md px-6 py-2 text-sm font-semibold duration-150 cursor-pointer;
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
  }
}
</style>
