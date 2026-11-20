import type { Participants } from '@/domain/duel/participant';

export const LOCAL_PARTICIPANTS: Participants = {
  host: { id: 'host', name: 'Игрок 1', initial: '1' },
  guest: { id: 'guest', name: 'Игрок 2', initial: '2' },
};
