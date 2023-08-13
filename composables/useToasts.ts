export interface Toast {
  index: number;
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  disapearCounter?: any;
}

export const useToasts = () => {
  const toasts = useState<Toast[]>('toasts', () => []);

  const createToast = (
    title: string,
    message: string,
    type: 'success' | 'error' | 'warning' | 'info'
  ) => {
    const toast: Toast = {
      index: toasts.value.length,
      title,
      message,
      type,
      disapearCounter: setTimeout(() => {
        removeToast(toast.index);
      }, 5000),
    };
    toasts.value.push(toast);
    toasts.value.filter((toast) => toast.index !== toasts.value.length - 1).forEach((toast) => {
      stopDisapearCounter(toast.index);
    });
  };

  const createSuccessToast = (title: string, message: string) => {
    createToast(title, message, 'success');
  };

  const createErrorToast = (title: string, message: string) => {
    createToast(title, message, 'error');
  };

  const createWarningToast = (title: string, message: string) => {
    createToast(title, message, 'warning');
  };

  const createInfoToast = (title: string, message: string) => {
    createToast(title, message, 'info');
  };

  const startDisapearCounter = (index: number) => {
    if(toasts.value[index] == undefined) return;
    toasts.value[index]['disapearCounter'] = setTimeout(() => {
      removeToast(index);
    }, 5000);
  };

  const stopDisapearCounter = (index: number) => {
    if(!toasts.value[index] || toasts.value[index].disapearCounter === undefined) return;
    clearTimeout(toasts.value[index].disapearCounter);
  };

  const removeToast = (index: number) => {
    toasts.value.splice(index, 1);
    if (toasts.value.length > 0) {
      toasts.value[toasts.value.length - 1].disapearCounter = setTimeout(() => {
        removeToast(toasts.value[toasts.value.length - 1].index);
      }, 5000);
    }
  };

  return {
    toasts,
    createToast,
    createSuccessToast,
    createErrorToast,
    createWarningToast,
    createInfoToast,
    removeToast,
    startDisapearCounter,
    stopDisapearCounter,
  };
};
