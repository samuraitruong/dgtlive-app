export interface FideSearchPlayerResponse {
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number | null;
    last_page: number;
    path: string;
    per_page: number;
    to: number | null;
    total: number;
  };
  players: FidePlayer[];
}

export interface FidePlayer {
  lastRatingUpdate?: Date;
  name: string;
  title?: string | null;
  id: string;
  table: string;
  country: string;
  rank: string;
  federation: string;
  ratings: {
    std: string;
    rapid: string;
    blitz: string;
  };
  birthYear: string;
  gender: string;
  fideTitle: string;
}
