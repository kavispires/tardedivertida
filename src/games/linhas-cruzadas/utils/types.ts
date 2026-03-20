export type PromptCard = {
  id: string;
  text: string;
  level?: number;
};

export type Prompt = {
  id: UID; // the album entry id
  author: UID; // the player who created the prompt
  content: string;
  type: 'title' | 'drawing';
  wordCount?: number;
};

export type SubmitPromptPayload = {
  promptId: string;
  randomSelection?: boolean;
};

export type SubmitDrawingPayload = {
  drawing: string;
};
export type SubmitGuessPayload = {
  guess: string;
};

export type Slide = {
  author: UID;
  content: string;
  type: 'title' | 'drawing' | 'cover';
};

export type AlbumEntry = {
  id: UID;
  text: string;
  cardId: string;
  slides: Slide[];
};
