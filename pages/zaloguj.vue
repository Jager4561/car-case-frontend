<script setup lang="ts">
import { useVuelidate } from '@vuelidate/core';
import { required, email } from '@vuelidate/validators';
import { helpers } from '@vuelidate/validators';

definePageMeta({
  layout: 'auth',
});

const isFormPending = ref(false);

const inputs = reactive({
  email: '',
  password: '',
});

const rules = {
  email: {
    required: helpers.withMessage('Musisz uzupelnić to pole.', required),
    email: helpers.withMessage('Niepoprawny format adresu e-mail.', email),
  },
  password: {
    required: helpers.withMessage('Musisz uzupelnić to pole.', required),
  },
};

const form = useVuelidate(rules, inputs);

const onFormSubmit = () => {
  form.value.$validate();
  if (form.value.$invalid) return;
  alert('Formularz jest poprawny!');
};
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
    <div class="logo">
      <h3><span class="highlight">CAR</span>CASE</h3>
    </div>
    <h1 class="page_title">Zaloguj się</h1>
    <p class="description">Wprowadź swoje dane, aby się zalogować.</p>
    <form class="login_form" @submit.prevent="onFormSubmit">
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
              <span v-for="error of form.password.$errors" :key="error.$uid">{{ error.$message }}</span>
            </div>
          </div>
        </div>
      </div>
      <button type="submit" class="submit_button">
        <span v-if="!isFormPending">Zaloguj się</span>
        <div v-if="isFormPending" class="dots">
          <div></div>
          <div></div>
          <div></div>
        </div>
      </button>
    </form>
    <div class="spacer"></div>
    <NuxtLink to="/odzyskiwanie-hasla" class="secondary_button">
      <span>Zapomniałeś hasła?</span>
    </NuxtLink>
    <NuxtLink to="/zarejestruj" class="secondary_button">
      <span>Nie masz konta? Zarejestruj się</span>
    </NuxtLink>
  </div>
</template>

<style scoped lang="scss">
.login_container {
  @apply w-full h-full flex flex-col items-start justify-center p-8 relative;
  @apply sm:p-16;

  .loading_mask {
    @apply absolute top-0 left-0 flex items-center justify-center w-full h-full bg-zinc-900 opacity-75 z-10;
  }

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

  .logo {
    @apply w-auto h-auto mb-4 select-none;

    h3 {
      @apply text-xl font-black leading-5;

      .highlight {
        @apply text-darkCyan;
      }
    }
  }

  .page_title {
    @apply w-full h-auto text-2xl font-normal leading-5 mb-4;
  }

  .description {
    @apply text-sm font-light mb-4;
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
