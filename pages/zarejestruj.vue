<script setup lang="ts">
import { useVuelidate } from '@vuelidate/core';
import { required, email, sameAs, minLength } from '@vuelidate/validators';
import { helpers } from '@vuelidate/validators';

definePageMeta({
  layout: 'auth',
});

const isFormPending = ref(false);
const stage = ref('enter_data');

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
    sameAs: helpers.withMessage('Hasła nie są identyczne.', sameAs(inputs.password)),
  },
};

const form = useVuelidate(rules, inputs);

const onFormSubmit = () => {
  form.value.$validate();
  if (form.value.$invalid) return;
  stage.value = 'done';
};
</script>

<template>
  <div class="login_container">
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
              <input v-model="form.name.$model" type="name" id="email" name="name" placeholder="Jan Kowalski" />

              <div class="error" :class="{ visible: form.email.$error && form.$dirty }">
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
                    <span v-for="error of form.name.$errors" :key="error.$uid">{{ error.$message }}</span>
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
                    <span v-for="error of form.password.$errors" :key="error.$uid">{{ error.$message }}<br></span>
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
