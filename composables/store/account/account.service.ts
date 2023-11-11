import { Account } from "./account.model";

export const useAccountService = () => {
  const { performRequest } = useRequests();

  const requestAccountData = async () => {
    const response = await performRequest<Account>('GET', '/account');
    return response;
  }

  const requestAvatarChange = async (payload: FormData) => {
    const response = await performRequest<{
      id: string;
      avatar: string;
    }>('POST', '/account/avatar', payload, true);
    return response;
  }

  const requestAvatarRemoval = async () => {
    const response = await performRequest<{
      id: string;
      avatar: string;
    }>('DELETE', '/account/avatar');
    return response;
  }

  const requestAccountUpdate = async (payload: {
    name: string;
  }) => {
    const response = await performRequest<Account>('PATCH', '/account', payload);
    return response;
  }

  const requestPasswordChange = async (payload: {
    current_password: string;
    new_password: string;
  }) => {
    const response = await performRequest<Account>('POST', '/account/password', payload);
    return response;
  }

  const requestAccountDeletion = async () => {
    const response = await performRequest<Account>('DELETE', '/account');
    return response;
  }

  return {
    requestAccountData,
    requestAvatarChange,
    requestAvatarRemoval,
    requestAccountUpdate,
    requestPasswordChange
  }
}