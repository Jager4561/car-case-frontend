import { apiUrl } from "./config";

export type ReqError = {
  type: string;
  message: string;
}

export const useRequests = () => {
  const performRequest = async <T>(method: string, route: string, data?: any): Promise<T | ReqError> => {
    const sessionState = useAuthState();
    const session = sessionState.sessionData.value;
    if(!session) {
      throw {
        type: 'no_session',
        message: 'No session found',
      };
    }
    const response = await fetch(`${apiUrl}${route}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
      },
      body: JSON.stringify(data),
    });
    if(response.status === 401) {
      const refresh = await fetch(`${apiUrl}/auth/refresh`, {
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
      } else {
        sessionState.deleteSession();
        throw {
          type: 'token_expired',
          message: 'Token expired',
        };
      }
    } else {
      return await response.json() as T;
    }
  }

  return {
    performRequest,
  }
}