// Internal
import { GamePlayers } from './player';

export type GameState<TState = PlainObject, TPlayer = PlainObject> = {
  phase: string;
  updatedAt?: DateMilliseconds;
  round: GameRound;
  players: GamePlayers<TPlayer>;
  redirect?: Redirect;
  [key: string]: any;
} & TState;

export type SessionProps = {
  gameId: GameId;
};

export type GameMeta = {
  createdAt: DateMilliseconds;
  createdBy: string;
  gameId: GameId;
  gameName: GameName;
  isComplete: boolean;
  isLocked: boolean;
  language: GameLanguage;
  max: number;
  min: number;
  options?: BooleanDictionary;
  replay: number;
  version: string;
};

export type GameRound = {
  current: number;
  total: number;
  forceLastRound: boolean;
};

export type PhaseProps<TState = PlainObject, TPlayer = PlainObject> = {
  state: GameState<TState, TPlayer>;
  players: GamePlayers<TPlayer>;
  meta: GameMeta;
};

export type GameRanking = {
  playerId: string;
  previousScore: number;
  gainedPoints: number | number[];
  newScore: number;
  [key: string]: any;
}[];

export type MostVotesResult = {
  /**
   * The property that signals the vote (usually `vote`)
   */
  property: string;
  /**
   * The value of the property that signals the vote
   */
  value: string;
  /**
   * The players who voted for this result
   */
  votes: PlayerId[];
  /**
   * How many players voted for this result
   */
  count: number;
  /**
   * In case of a tie in most votes (count)
   */
  tie?: boolean;
};
