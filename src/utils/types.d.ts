type PlainObject = {
  [key: string]: any;
};

type DateMilliseconds = number;
type GameCode = string;
type GameId = string;
type GameLanguage = string;
type GameName = string;
type GameOrder = PlayerId[];
type ImageCard = string;
type Language = 'en' | 'pt';
type PlayerAvatarId = string;
type PlayerId = string;
type PlayerName = string;
type Primitive = string | number | boolean | symbol | null;
type TurnOrder = PlayerId[];

interface Player {
  id: PlayerId;
  name: PlayerName;
  avatarId: PlayerAvatarId;
  updatedAt: DateMilliseconds;
  [key: string]: any;
}

interface Players {
  [key: string]: Player;
}

interface State {
  phase?: string;
  updatedAt?: DateMilliseconds;
  [key: string]: any;
}
