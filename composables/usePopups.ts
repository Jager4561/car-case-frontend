import { Subject } from "rxjs";

const popupSubject = new Subject<string | null>();

export const usePopups = () => {
  const showPopup = (name: string) => {
    popupSubject.next(name);
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