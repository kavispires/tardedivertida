type PlainObject = {
  [key: string]: any;
};

type GameId = string;
type GameName = string;
type GameCode = string;
type GameLanguage = string;
type DateMilliseconds = number;
type PlayerId = string;
type PlayerName = string;
type PlayerAvatarId = string;
type Primitive = string | number | boolean | symbol | null;
type ImageCard = string;

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

type GameOrder = PlayerId[];
type TurnOrder = PlayerId[];
