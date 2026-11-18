import type { PlayerId } from './dice';

/**
 * после авторизации здесь будут имя из профиля и имя напарника с сервера.
 */
export interface Participant {
  id: PlayerId;
  name: string;
  /** Что написано в кружке-аватаре: первая буква имени или номер. */
  initial: string;
}

export type Participants = Record<PlayerId, Participant>;
