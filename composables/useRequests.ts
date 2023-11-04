export type ReqError = {
  type: string;
  message: string;
}

export const useRequests = () => {
  const runtimeConfig = useRuntimeConfig();

  const performRequest = async <T>(method: string, route: string, data?: any, isFormData?: boolean): Promise<T | ReqError> => {
    const sessionState = useAuthState();
    const session = sessionState.sessionData.value;
    if(!session) {
      throw {
        type: 'no_session',
        message: 'No session found',
      };
    }
    const headers = new Headers();
    headers.append('Authorization', `Bearer ${session.access_token}`);
    if(!isFormData) {
      headers.append('Content-Type', 'application/json');
    }
    const response = await fetch(`${runtimeConfig.public.apiUrl}${route}`, {
      method,
      headers: headers,
      body: isFormData ? data : JSON.stringify(data), 
    });
    if(response.status === 401) {
      const refresh = await fetch(`${runtimeConfig.public.apiUrl}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refresh_token: session.refresh_token,
        }),
      });
      if(refresh.status === 200) {
        sessionState.saveSession(await refresh.json());
        return await performRequest(method, route, data);
      } else if (refresh.status === 401) {
        sessionState.deleteSession();
        throw {
          type: 'token_expired',
          message: 'Token expired',
        };
      } else {
        throw await refresh.json() as ReqError;
      }
    } else if (!response.ok) {
      throw await response.json() as ReqError;
    } else {
      return await response.json() as T;
    }
  }

  return {
    performRequest,
  }
}