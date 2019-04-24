import { Subject } from 'rxjs';

const modalToShow = new Subject();
export const modalToShow$ = modalToShow.asObservable();


export function showModal(ComponentToShowInModal) {
    modalToShow.next(ComponentToShowInModal)
}
