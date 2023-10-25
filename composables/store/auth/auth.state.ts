export const useAuthState = () => {
  const sessionData = useState<{
    access_token: string;
    expires: number;
    refresh_token: string;
  } | null>('auth_session', () => null);
  const isLoggedIn = useState('auth_loggedIn', () => false);

  const initSessionState = () => {
    const session = localStorage.getItem('auth_session');
    if(session) {
      sessionData.value = JSON.parse(session);
      isLoggedIn.value = true;
    }
  }

  const getAccessToken = () => {
    return sessionData.value?.access_token || null;
  }

  const saveSession = (data: {
    access_token: string;
    expires: number;
    refresh_token: string;
  }) => {
    sessionData.value = data;
    localStorage.setItem('auth_session', JSON.stringify(data));
    isLoggedIn.value = true;
  }

  const deleteSession = () => {
    sessionData.value = null;
    localStorage.removeItem('auth_session');
    isLoggedIn.value = false;
  }

  return {
    isLoggedIn,
    sessionData,
    initSessionState,
    getAccessToken,
    saveSession,
    deleteSession
  };
}