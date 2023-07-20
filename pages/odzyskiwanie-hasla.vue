<script setup lang="ts">
import { useVuelidate } from '@vuelidate/core';
import { required, email } from '@vuelidate/validators';
import { helpers } from '@vuelidate/validators';

definePageMeta({
  layout: 'auth',
});

const isFormPending = ref(false);
const stage = ref('enter_email');

const inputs = reactive({
  email: '',
});

const rules = {
  email: {
    required: helpers.withMessage('Musisz uzupelnić to pole.', required),
    email: helpers.withMessage('Niepoprawny format adresu e-mail.', email),
  },
};

const form = useVuelidate(rules, inputs);

const onFormSubmit = () => {
  form.value.$validate();
  if (form.value.$invalid) return;
  stage.value = 'email_sent';
};
</script>

<template>
  <div class="login_container">
    <NuxtLink to="/" class="logo">
      <h3><span class="highlight">CAR</span>CASE</h3>
    </NuxtLink>
    <Transition name="fade" mode="out-in">
      <div v-if="stage === 'enter_email'" class="stage">
        <h1 class="page_title">Zapomniałeś hasło?</h1>
        <p class="description">Wprowadź swój adres e-mail, aby zresetować hasło.</p>
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
          <button type="submit" class="submit_button">
            <span v-if="!isFormPending">Wyślij wiadomość</span>
            <div v-if="isFormPending" class="dots">
              <div></div>
              <div></div>
              <div></div>
            </div>
          </button>
        </form>
      </div>
      <div v-else-if="stage === 'email_sent'" class="stage">
        <h1 class="page_title">E-mail został wysłany.</h1>
        <p class="description">Na skrzynkę poczty e-mail powiązaną z twoim kontem została wysłana wiadomość z linkiem do resetowania hasła. Sprawdź również folder SPAM.</p>
      </div>
    </Transition>
    <div class="spacer"></div>
    <NuxtLink to="/zaloguj" class="secondary_button">
      <span>Wróć do logowania</span>
    </NuxtLink>
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
