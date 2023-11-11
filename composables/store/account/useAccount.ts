import { Account } from './account.model';

export const useAccount = () => {
  const {
    requestAccountData,
    requestAvatarChange,
    requestAvatarRemoval,
    requestAccountUpdate,
    requestPasswordChange,
  } = useAccountService();

  const account = useState<Account | null>('account', () => null);
  const fetchPending = useState<boolean>('accountFetchPending', () => false);

  const fetchAccount = async () => {
    fetchPending.value = true;
    const response = await requestAccountData();
    account.value = response as Account;
    fetchPending.value = false;
    return response;
  };

  const changeAvatar = async (payload: FormData) => {
    try {
      const result = (await requestAvatarChange(payload)) as {
        id: string;
        avatar: string;
      };
      account.value!.avatar = result.avatar;
      return result;
    } catch (error) {
      throw error;
    }
  };

  const removeAvatar = async () => {
    try {
      const result = await requestAvatarRemoval();
      account.value!.avatar = null;
      return result;
    } catch (error) {
      throw error;
    }
  };

  const updateUsername = async (username: string) => {
    try {
      const result = await requestAccountUpdate({
        name: username,
      }) as Account;
      account.value!.name = result.name;
      return result;
    } catch (error) {
      throw error;
    }
  };

  const changePassword = async (payload: {
    current_password: string;
    new_password: string;
  }) => {
    try {
      const result = await requestPasswordChange(payload) as Account;
      account.value!.last_password_change = result.last_password_change;
      return result;
    } catch (error) {
      throw error;
    }
  };

  const deleteAccount = async () => {
    try {
      const result = await requestAccountDeletion();
      return result;
    } catch (error) {
      throw error;
    }
  }

  const resetState = () => {
    account.value = null;
    fetchPending.value = false;
  }

  return {
    account,
    fetchPending,
    fetchAccount,
    changeAvatar,
    removeAvatar,
    updateUsername,
    changePassword,
    resetState,
    deleteAccount
  };
};
