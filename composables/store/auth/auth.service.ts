import { apiUrl } from '@/composables/config';

export async function loginUser(payload: {
  email: string;
  password: string;
}): Promise<{
  access_token: string;
  expires: number;
  refresh_token: string;
}> {
  const response = await fetch(`${apiUrl}/auth/login`, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if(!response.ok) throw await response.json();
  return response.json();
}

export async function registerUser(payload: {
  name: string;
  email: string;
  password: string;
}) {
  const response = await fetch(`${apiUrl}/register`, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if(!response.ok) throw await response.json();
  return response.json();
}

export async function resendActivationEmail(email: string) {
  const response = await fetch(`${apiUrl}/register/resend`, {
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

export async function activateAccount(payload: {
  token: string;
}) {
  const response = await fetch(`${apiUrl}/register/activate`, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if(!response.ok) throw await response.json();
  return response.json();
}

export async function resetPassword(email: string) {
  const response = await fetch(`${apiUrl}/auth/reset-password`, {
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

export async function resendResetPasswordEmail(email: string) {
  const response = await fetch(`${apiUrl}/auth/resend-reset-email`, {
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

export async function changePassword(payload: {
  token: string;
  password: string;
}) {
  const response = await fetch(`${apiUrl}/auth/change-password`, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if(!response.ok) throw await response.json();
  return response.json();
}

export async function logoutUser(refreshToken: string) {
  const response = await fetch(`${apiUrl}/auth/logout`, {
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