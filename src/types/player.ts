export type GamePlayer<TPlayer = PlainObject> = {
  id: PlayerId;
  name: PlayerName;
  avatarId: PlayerAvatarId;
  updatedAt: DateMilliseconds;
  ready: boolean;
  [key: string]: any;
} & TPlayer;

export type GamePlayers<TPlayer = PlainObject> = Record<PlayerId, GamePlayer<TPlayer>>;
