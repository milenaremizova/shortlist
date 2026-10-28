import type { MovieDto } from './toMovieDto.ts';

export interface MovieSearch {
  search(query: string, page?: number): Promise<MovieDto[]>;
}
