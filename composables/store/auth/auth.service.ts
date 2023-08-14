export const useAuthService = () => {
  const runtimeConfig = useRuntimeConfig();

  async function loginUser(payload: {
    email: string;
    password: string;
  }): Promise<{
    access_token: string;
    expires: number;
    refresh_token: string;
  }> {
    const response = await fetch(`${runtimeConfig.public.apiUrl}/auth/login`, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if(!response.ok) throw await response.json();
    return response.json();
  }
  
  async function registerUser(payload: {
    name: string;
    email: string;
    password: string;
  }) {
    const response = await fetch(`${runtimeConfig.public.apiUrl}/register`, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if(!response.ok) throw await response.json();
    return response.json();
  }
  
  async function resendActivationEmail(email: string) {
    const response = await fetch(`${runtimeConfig.public.apiUrl}/register/resend`, {
      method: 'POST',
      body: JSON.stringify({
        email,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if(!response.ok) throw await response.json();
    return response.json();
  }
  
  async function activateAccount(payload: {
    token: string;
  }) {
    const response = await fetch(`${runtimeConfig.public.apiUrl}/register/activate`, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if(!response.ok) throw await response.json();
    return response.json();
  }
  
  async function resetPassword(email: string) {
    const response = await fetch(`${runtimeConfig.public.apiUrl}/auth/reset-password`, {
      method: 'POST',
      body: JSON.stringify({
        email,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if(!response.ok) throw await response.json();
    return response.json();
  }
  
  async function resendResetPasswordEmail(email: string) {
    const response = await fetch(`${runtimeConfig.public.apiUrl}/auth/resend-reset-email`, {
      method: 'POST',
      body: JSON.stringify({
        email,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if(!response.ok) throw await response.json();
    return response.json();
  }
  
  async function changePassword(payload: {
    token: string;
    password: string;
  }) {
    const response = await fetch(`${runtimeConfig.public.apiUrl}/auth/change-password`, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if(!response.ok) throw await response.json();
    return response.json();
  }
  
  async function logoutUser(refreshToken: string) {
    const response = await fetch(`${runtimeConfig.public.apiUrl}/auth/logout`, {
      method: 'POST',
      body: JSON.stringify({
        refresh_token: refreshToken,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if(!response.ok) throw await response.json();
    return response.json();
  }

  return {
    loginUser,
    registerUser,
    resendActivationEmail,
    activateAccount,
    resetPassword,
    resendResetPasswordEmail,
    changePassword,
    logoutUser,
  }
}

