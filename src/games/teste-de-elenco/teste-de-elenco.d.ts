type SubmitMovieGenrePayload = {
  genre: string;
};
type SubmitMovieActorPayload = {
  actorId: string;
};

type MovieGenreOption = {
  title: DualLanguageValue;
  key: string;
};

type MovieRole = {
  id: string;
  title: DualLanguageValue;
  description: DualLanguageValue;
  complexity: number;
  pool: number;
};

type ActingRole = {
  id: string;
  title: DualLanguageValue;
  description: DualLanguageValue;
  traits: string[];
  candidates: Collection<SuspectCard>;
  selection: ActorId[];
  actor?: ActorId;
  cast: boolean;
  round: number;
  directors: PlayerId[];
};

type FeatureFilm = {
  id: string;
  title: DualLanguageValue;
  roles: Collection<ActingRole>;
  rolesOrder: string[];
};
