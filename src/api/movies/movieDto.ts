export interface MovieDto {
  id: string;
  title: string;
  genre: string | null;
  description: string | null;
  year: number | null;
  posterUrl: string | null;
  durationMin: number | null;
}
