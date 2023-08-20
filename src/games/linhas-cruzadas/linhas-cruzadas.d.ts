type PromptCard = {
  id: string;
  text: string;
  level?: number;
};

type Prompt = {
  id: PlayerId; // the album entry id
  author: PlayerId; // the player who created the prompt
  content: string;
  type: 'title' | 'drawing';
  wordCount?: number;
};

type SubmitPromptPayload = {
  promptId: string;
  randomSelection?: boolean;
};

type SubmitDrawingPayload = {
  drawing: string;
};
type SubmitGuessPayload = {
  guess: string;
};

type LSlide = {
  author: PlayerId;
  content: string;
  type: 'title' | 'drawing' | 'cover';
};

type LAlbumEntry = {
  id: PlayerId;
  text: string;
  cardId: string;
  slides: Slide[];
};
