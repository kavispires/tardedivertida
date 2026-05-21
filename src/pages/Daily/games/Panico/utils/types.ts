// Pages
import type { DateKey } from 'pages/Daily/utils/types';
// Internal
import type { ButtonDictionaryEntry, PoolGroupEntry } from './data';

export type GameState = {
  id: DateKey;
  number: number;
  status: string;
  hearts: number;
  totalButtons: number;
  farthestButtonIndex: number;
};

export type DailyPanicoEntry = {
  id: DateKey;
  number: number;
  type: 'panico';
  buttons: string[];
};

export type SessionState = {
  buttons: ButtonEntry[];
  activeButtonIndex: number;
  status: 'idle' | 'ongoing';
};

export type ButtonEntry = {
  /**
   * The id of the button (from data)
   */
  id: string;
  /**
   * The index for the value to use from the pool
   */
  pool?: PoolGroupEntry;
} & Pick<
  ButtonDictionaryEntry,
  | 'key'
  | 'category'
  | 'targetCount'
  | 'expectedAction'
  | 'verification'
  | 'durationScale'
  | 'keyword'
  | 'dependsOn'
  | 'eitherOr'
  | 'buttonVariant'
>;
