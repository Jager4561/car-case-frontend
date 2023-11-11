import { Subject } from "rxjs";

const popupSubject = new Subject<{
  name: string;
  options?: any;
} | null>();

export const usePopups = () => {
  const showPopup = (name: string, options?: any) => {
    popupSubject.next({
      name,
      options
    });
  }

  const hidePopup = () => {
    popupSubject.next(null);
  }

  const popupListener = () => {
    return popupSubject.asObservable();
  }

  return {
    popupListener,
    showPopup,
    hidePopup
  }
}