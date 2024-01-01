export type SubmitCharactersPayload = {
  characters: CardId[];
};

export type SubmitGlyphsPayload = {
  glyphs: BooleanDictionary;
};

export type SubmitGuessesPayload = {
  guesses: StringDictionary;
  choseRandomly: boolean;
};

export type Character = ContenderCard & {
  playerId?: PlayerId;
};

export type Characters = Dictionary<Character>;

export type GalleryEntry = {
  playerId: PlayerId;
  characterId: CardId;
  glyphs: BooleanDictionary;
  playersSay: Record<CardId, PlayerId[]>;
  playersPoints: Record<PlayerId, number>;
};

export type FinalCharacterEntry = {
  id: CardId;
  name: DualLanguageValue;
  glyphs: BooleanDictionary;
  playerId: PlayerId;
};
