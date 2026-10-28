/** фильм в ответе ПоискКино (SearchMovieDtoV1_4). обязателен только id. */
export interface PoiskkinoMovie {
  id: number;
  name?: string | null;
  alternativeName?: string | null;
  enName?: string | null;
  year?: number | null;
  movieLength?: number | null;
  shortDescription?: string | null;
  description?: string | null;
  genres?: { name: string }[] | null;
  poster?: { url?: string | null; previewUrl?: string | null } | null;
}

/** ответ поиска целиком */
export interface PoiskkinoSearchResponse {
  docs: PoiskkinoMovie[];
  total: number;
  limit: number;
  page: number;
  pages: number;
}

/** фильм, который сервер отдает клиенту */
export interface MovieDto {
  id: string;
  title: string;
  description: string | null;
  year: number | null;
  genre: string | null;
  durationMin: number | null;
  posterUrl: string | null;
}

export function toMovieDto(movie: PoiskkinoMovie): MovieDto {
  return {
    id: String(movie.id),
    title: movie.name || movie.alternativeName || movie.enName || 'Без названия',
    description: movie.shortDescription || movie.description || null,
    genre: movie.genres?.[0]?.name ?? null,
    posterUrl: movie.poster?.previewUrl || movie.poster?.url || null,
    year: movie.year ?? null,
    durationMin: movie.movieLength || null,
  };
}
