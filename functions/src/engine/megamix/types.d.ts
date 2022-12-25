import { MEGAMIX_ACHIEVEMENTS, MEGAMIX_ACTIONS } from './constants';

export type MegamixGameOptions = {
  nsfw: boolean;
  allMinigames: boolean;
};

export interface PossibleTask {
  game: string;
  condition: string;
  variants?: string[];
  upcoming?: boolean;
  nsfw?: boolean;
}

export interface AvailableTask {
  game: string;
  variant?: string;
  upcoming?: boolean;
  nsfw?: boolean;
}

export interface Task {
  game: string;
  variant?: string;
  condition: string;
  data: Record<string, any>;
}

export interface MostScoring {
  condition: string;
  winningTeam: PlayerId[];
  losingTeam: PlayerId[];
  winningValues: (string | number)[];
  scoringType: 'NORMAL' | 'TIE' | 'DRAW';
}

type MegamixCard = any;

export type CardsByLevel = Record<string, MegamixCard[]>;

export type ResourceData = {
  tasks: Task[];
};

export interface MegamixDrawing extends MegamixCard {
  playerId: PlayerId | null;
  drawing: string | null;
  successRate: number;
}

export interface MegamixStore extends DefaultStore {
  deck: MegamixCard[];
  currentCards: MegamixCard[] | MegamixDrawing[];
  pastDrawings: MegamixDrawing[];
}

export interface MegamixState extends DefaultState {
  drawings?: any;
  gallery?: any;
  cards?: any;
  ranking?: any;
  winners?: any;
  [key: string]: any;
}

export interface MegamixPlayer extends Player {
  votes: any;
}

export type MegamixPlayers = Record<PlayerId, MegamixPlayer>;

export type MegamixAchievement = keyof typeof MEGAMIX_ACHIEVEMENTS;

export interface MegamixInitialState extends InitialState {
  store: MegamixStore;
  state: MegamixState;
}

export interface MegamixSubmitAction extends Payload {
  action: keyof typeof MEGAMIX_ACTIONS;
}

export type FirebaseStateData = FirebaseFirestore.DocumentData & MegamixState;
export type FirebaseStoreData = FirebaseFirestore.DocumentData & MegamixStore;
export type FirebasePlayersData = FirebaseFirestore.DocumentData & MegamixPlayers;
