type SubmitCharactersPayload = {
  characters: CardId[];
};

type SubmitGlyphsPayload = {
  glyphs: BooleanDictionary;
};

type SubmitGuessesPayload = {
  guesses: StringDictionary;
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