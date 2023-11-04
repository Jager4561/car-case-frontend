export default defineNuxtRouteMiddleware((to, from) => {
  if(process.server) return;
  const { isLoggedIn, isInitialized, initSessionState } = useAuthState();
  if(process.client && !isInitialized.value) {
    initSessionState();
  }
  if(isLoggedIn.value) {
    return navigateTo('/');
  }
})