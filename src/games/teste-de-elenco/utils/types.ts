import { SuspectCard } from 'types/tdi';

export type SubmitMovieGenrePayload = {
  genre: string;
};
export type SubmitMovieActorPayload = {
  actorId: string;
};

export type MovieGenreOption = {
  title: DualLanguageValue;
  key: string;
};

export type MovieRole = {
  id: string;
  title: DualLanguageValue;
  description: DualLanguageValue;
  complexity: number;
  pool: number;
};

export type ActorId = string;

export type ActingRole = {
  id: string;
  title: DualLanguageValue;
  description: DualLanguageValue;
  traits: string[];
  candidates: Dictionary<SuspectCard>;
  selection: ActorId[];
  actor?: ActorId;
  cast: boolean;
  round: number;
  directors: PlayerId[];
  type: string;
};

export type FeatureFilm = {
  id: string;
  title: DualLanguageValue;
  roles: Dictionary<ActingRole>;
  rolesOrder: string[];
};
