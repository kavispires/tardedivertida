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

interface Character {
  id: CardId;
  name: DualLanguageValue;
  exclusivity?: boolean;
  playerId?: PlayerId;
}

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
