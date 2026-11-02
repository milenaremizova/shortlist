import type { Item } from '@/domain/types';

import type { MovieDto } from './movieDto';

export function formatDuration(min: number): string {
  const hours = Math.floor(min / 60);
  const minutes = min % 60;

  if (minutes === 0) return `${hours} ч`;
  if (hours === 0) return `${minutes} мин`;

  return `${hours} ч ${minutes} мин`;
}

export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function toItem(dto: MovieDto): Item {
  const filmDuration = dto.durationMin !== null ? formatDuration(dto.durationMin) : null;

  const metaParts = [dto.year, filmDuration].filter((part) => part !== null);
  const meta = metaParts.length > 0 ? metaParts.join(' · ') : undefined;

  const tag = dto.genre ? capitalize(dto.genre) : undefined;

  return {
    id: `film-${dto.id}`,
    title: dto.title,
    category: 'film',
    tag,
    description: dto.description ? dto.description : undefined,
    meta,
    imageUrl: dto.posterUrl,
  };
}
