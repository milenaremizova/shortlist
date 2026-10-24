import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { toMovieDto, type PoiskkinoMovie } from './toMovieDto.ts';

function makeMovie(patch: Partial<PoiskkinoMovie> = {}): PoiskkinoMovie {
  return {
    id: 1,
    name: 'Дюна',
    alternativeName: 'Dune',
    year: 2021,
    movieLength: 155,
  shortDescription: 'Наследник знатной семьи становится мессией пустынного народа',
    description: 'Полное описание фильма',
    genres: [{ name: 'фантастика' }, { name: 'драма' }],
    poster: { url: 'https://img/full.jpg', previewUrl: 'https://img/preview.jpg' },
    ...patch,
  };
}

describe('toMovieDto', () => {
  it('переводит фильм в формат клиента', () => {
    // Arrange
    const movie = makeMovie();

    // Act
    const dto = toMovieDto(movie);

    // Assert
    assert.deepEqual(dto, {
      id: '1',
      title: 'Дюна',
      year: 2021,
      genre: 'фантастика',
      description: 'Наследник знатной семьи становится мессией пустынного народа',
      durationMin: 155,
      posterUrl: 'https://img/preview.jpg',
    });
  });

  it('без name берёт alternativeName', () => {
    // Arrange
    const movie = makeMovie({ name: null });

    // Act
    const dto = toMovieDto(movie);

    // Assert
    assert.equal(dto.title, 'Dune');
  });

  it('без постера берёт posterUrl', () => {
    // Arrange
    const movie = makeMovie({ name: null });

    // Act
    const dto = toMovieDto(movie);

    // Assert
    assert.equal(dto.posterUrl, 'https://img/preview.jpg');
  });

  it('без постера posterUrl равен null', () => {
    // Arrange
    const movie = makeMovie({ poster: null });

    // Act
    const dto = toMovieDto(movie);

    // Assert
    assert.equal(dto.posterUrl, null);
  });

  it('без previewUrl берёт url', () => {
    // Arrange
    const movie = makeMovie({
      poster: { url: 'https://img/full.jpg', previewUrl: null },
    });

    // Act
    const dto = toMovieDto(movie);

    // Assert
    assert.equal(dto.posterUrl, 'https://img/full.jpg');
  });

  it('без shortDescription берёт description', () => {
    // Arrange
    const movie = makeMovie({ shortDescription: null, description: 'Полное описание фильма' });

    // Act
    const dto = toMovieDto(movie);

    // Assert
    assert.equal(dto.description, 'Полное описание фильма');
  });
});
