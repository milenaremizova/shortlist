export interface Movie {
    id: string;
    title: string;
    year: number;
    posterUrl: string | null;
}

export interface Pair {
    left: Movie;
    right: Movie;
}

export interface Comparison {
    leftId: string;
    rightId: string;
    winnerId: string;
}

export interface Ranking {
    places: Movie[];
    isFinal: boolean;
}