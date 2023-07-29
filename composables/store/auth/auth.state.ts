export const useAuthState = () => {
  const isLoggedIn = useState('auth_loggedIn', () => false);

  return {
    isLoggedIn,
  };
}