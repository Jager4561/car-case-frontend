<script setup lang="ts">

definePageMeta({
  middleware: [
    'auth',
  ],
});

useSeoMeta({
  title: 'Konto',
});

const { logoutUser } = useAuthService();
const { deleteSession, sessionData } = useAuthState();

const logout = async () => {
  try {
    if(sessionData.value != null) {
      await logoutUser(sessionData.value.refresh_token);
    }
    deleteSession();
    navigateTo('/');
  } catch (error) {
    console.error(error);
    deleteSession();
    navigateTo('/');
  }
}
</script>

<template>
  <div class="container">
    <button class="text-button text-button__danger text-button__medium" @click="logout()">
      Wyloguj się
    </button>
  </div>
</template>

<style scoped lang="scss">
  .container {
    @apply p-6;
  }
</style>