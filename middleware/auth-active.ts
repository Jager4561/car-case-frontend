export default defineNuxtRouteMiddleware((to, from) => {
  const { isLoggedIn } = useAuthState();
  if(isLoggedIn.value) {
    return navigateTo('/');
  }
})