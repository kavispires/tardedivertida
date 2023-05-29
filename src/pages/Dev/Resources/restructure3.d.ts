type AchievementKey = string;
type UID = string;

interface GameUserEntry {
  gameName?: GameName;
  gameId: GameId;
  startedAt: number;
  endedAt: number;
  playerCount: number;
  placement: number;
  win?: boolean;
  last?: boolean;
  achievements: AchievementKey[];
}

// /users/<uid>/FirebaseUserDB
interface FirebaseUserDB {
  id: UID;
  isAdmin?: boolean;
  isGuest?: boolean;
  preferredLanguage: Language;
  names: string[]; // unique list but most recent comes last
  gender?: string;
  avatars: Record<AvatarId, number>;
  ratings: Record<GameName, number>;
  games: Record<GameName, Record<GameId, GameUserEntry>>;
  blurredImages: Record<ImageCardId, true>;
}

// /games/<gameName>/<gameId>/GameSession
interface GameSession {
  state: GameState;
  store: GameStore;
}

// /games/GameLibraries
type GameLibraries = Record<GameName, Record<GameId, GameSession>>;

type Metas = Record<GameId, GameMeta>;

interface Achievement {
  type: string;
  playerId: PlayerId;
  value: Primitive;
}

type SaveGameToUsersProps = {
  gameName: string;
  gameId: GameId;
  startedAt: DateMilliseconds;
  endedAt: DateMilliseconds;
  players: GamePlayers;
  winners: GamePlayer[];
  achievements: Achievement<unknown>[];
};

type OpposingIdeaClue = { [key: number]: string }; // Needle: clue
