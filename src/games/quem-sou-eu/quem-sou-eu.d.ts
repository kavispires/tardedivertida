type SubmitCharactersPayload = {
  characters: CardId[];
};

type SubmitGlyphsPayload = {
  glyphs: BooleanDictionary;
};

type SubmitGuessesPayload = {
  guesses: StringDictionary;
  choseRandomly: boolean;
};

type Character = ContenderCard & {
  playerId?: PlayerId;
};

type Characters = Record<CardId, Character>;

type GalleryEntry = {
  playerId: PlayerId;
  characterId: CardId;
  glyphs: BooleanDictionary;
  playersSay: Record<CardId, PlayerId[]>;
  playersPoints: Record<PlayerId, number>;
};

type FinalCharacter = {
  id: CardId;
  name: DualLanguageValue;
  glyphs: BooleanDictionary;
  playerId: PlayerId;
};
