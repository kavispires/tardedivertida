// Types
import type { ContenderCard } from 'types/tdr';

export type SubmitCharactersPayload = {
  characters: UID[];
};

export type SubmitGlyphsPayload = {
  glyphs: Dictionary<boolean>;
};

export type SubmitGuessesPayload = {
  guesses: Dictionary<string>;
  choseRandomly: boolean;
};

export type Character = ContenderCard & {
  playerId?: UID;
};

export type Characters = Dictionary<Character>;

export type GalleryEntry = {
  playerId: UID;
  characterId: UID;
  glyphs: Dictionary<boolean>;
  playersSay: Record<UID, UID[]>;
  playersPoints: Record<UID, number>;
};

export type FinalCharacterEntry = {
  id: UID;
  name: DualLanguageValue;
  description: DualLanguageValue;
  glyphs: Dictionary<boolean>;
  playerId: UID;
};
