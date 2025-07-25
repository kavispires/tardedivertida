/**
 * Generic text card
 * Used for: adjectives, categories, challenges, characters, galeria-de-sonhos, labirinto-secreto,
 * linhas-cruzadas, scenarios, single-words, spy-questions, things-qualities, emotions, colors
 */
export type TextCard = {
  /**
   * Unique identifier for the card
   */
  id: CardId;
  /**
   * The text of the card
   */
  text: string;
  /**
   * Flag indicating if it's nsfw
   */
  nsfw?: boolean;
  /**
   * Flag indicating if it's exclusive to a group
   */
  private?: boolean;
};

/**
 * Arte Ruim Card
 * Used for: arte-ruim-cards
 */
export type ArteRuimCard = {
  /**
   * Unique identifier for the card
   */
  id: CardId;
  /**
   * the text of the card
   */
  text: string;
  /**
   * The level of difficulty of the card (0-5)
   */
  level: number;
};

/**
 * Arte Ruim Card
 * Used for: arte-ruim-groups
 */
export type ArteRuimGroup = {
  /**
   * Unique identifier for the card
   */
  id: string;
  /**
   * The name of the group
   */
  theme: string;
  /**
   * The cards in the group
   */
  cards: Record<ArteRuimCard['id'], ArteRuimCard['text']>;
};

/**
 * Arte Ruim Pair
 * Used for: arte-ruim-pairs
 */
export type ArteRuimPair = {
  /**
   * Unique identifier for the card
   */
  id: string;
  /**
   * The two cards (text) in the pair
   */
  values: [string, string];
};

/**
 * Boss Idea card
 * Used for: warehouse-boss-ideas
 */
export type BossIdeaCard = {
  id: string;
  /**
   * The title of the boss idea.
   */
  title: DualLanguageValue;
  /**
   * The boss idea speech bubble.
   */
  subtitle: DualLanguageValue;
  /**
   * The instructions of the idea
   */
  description: DualLanguageValue;
  /**
   * The level of difficulty
   */
  difficulty: number;
  /**
   * The original rule
   */
  ogRule?: string;
};

/**
 * Choice Card
 * Used for: choices
 */
export type ChoiceCard = {
  /**
   * Unique identifier for the card
   */
  id: string;
  /**
   * The type of the card
   */
  type: 'best-of-three' | 'this-that';
  /**
   * The list of options
   */
  options: string[];
  /**
   * The question (only present when type is best-of-three)
   */
  question?: string;
};

/**
 * City Location Card
 * Used for: planejamento-urbano
 */
export type CityLocation = {
  /**
   * Unique identifier for the card
   */
  id: string;
  /**
   * The name of the location
   */
  name: DualLanguageValue;
  /**
   * The category of the location
   */
  category: string;
  /**
   * Flag indicating if it's NSFW
   */
  nsfw?: boolean;
};

/**
 * Concept Card
 * Used for: concepts
 */
export type Concept = {
  /**
   * Unique identifier for the card
   */
  id: CardId;
  /**
   * The name of the concept
   */
  name: string;
  /**
   * Other names for the concept
   */
  additionalNames: string[];
  /**
   * Query terms using when searching for the concept
   */
  queryTerms: string;
  /**
   * Flag indicating if the concept is default (original to the game)
   */
  default: boolean;
  /**
   * The type of concept
   */
  type: string;
};

/**
 * Contender Card
 * Used for: contenders
 */
export type ContenderCard = {
  /**
   * Unique identifier for the card
   */
  id: CardId;
  /**
   * The name of the contender
   */
  name: DualLanguageValue;
  /**
   * If the contender is exclusive to a language
   */
  exclusivity?: Language;
  /**
   * The characters description
   */
  description?: DualLanguageValue;
  /**
   * The groups the contender belongs to
   */
  decks?: string[];
  /**
   * Flag indicating if it's NSFW
   */
  nsfw?: boolean;
};

/**
 * Crime Hediondo Card
 * Used for: crime-evidence, crime-weapons
 */
export type CrimesHediondosCard = {
  /**
   * Unique identifier for the card
   */
  id: CardId;
  /**
   * The type of the card
   */
  type: 'weapon' | 'evidence' | 'location' | 'victim' | (string & NonNullable<unknown>);
  /**
   * The name of the card
   */
  name: DualLanguageValue;
  /**
   * Item Id for the illustration icon
   */
  itemId?: string;
  /**
   * The likelihood of the answers for a given scene
   */
  likelihood?: Record<string, number[]>;
};

/**
 * Crime Scene Tile
 * Used for: crime-tiles
 */
export type CrimeSceneTile = {
  /**
   * Unique identifier for the card
   */
  id: string;
  /**
   * The title of the crime scene tile
   */
  title: DualLanguageValue;
  /**
   * The description of the crime scene tile
   */
  description: DualLanguageValue;
  /**
   * Array of values of the crime scene tile (always 6)
   */
  values: DualLanguageValue[];
  /**
   * The type (cause, evidence, location, scene)
   */
  type: string;
  /**
   * Flag indicating if the tile is for a specific type of card
   */
  specific?: string | null;
  /**
   * Indicates the order card types should be analyzed
   */
  likelihoodPriority?: string[];
};

/**
 * Crime Reason Card
 * Used for: crime-reasons
 */
export type CrimeReason = {
  /**
   * Unique identifier for the card
   */
  id: string;
  /**
   * The title of the crime reason tile
   */
  title: DualLanguageValue;
  /**
   * The feature associated with the crime reason (usually 'general')
   */
  feature: string;
};

/**
 * Dating Candidate Card
 * Used for: dating-candidate
 */
export type DatingCandidateCard = {
  /**
   * Unique identifier for the card
   */
  id: CardId;
  /**
   * The text of the card
   */
  text: string;
  /**
   * The type of the card
   */
  type: 'fun-fact' | 'interest' | 'need';
};

/**
 * Dating Candidate Image Card
 * Used for: dating-candidate-heads, dating-candidate-bodies
 */
export type DatingCandidateImageCard = {
  /**
   * Unique identifier for the card
   */
  id: CardId;
  /**
   * The name of the image
   */
  name: DualLanguageValue;
  /**
   * The type of the card
   */
  type: 'head' | 'body';
};

export type DiagramTopic = {
  /**
   * Unique identifier for the card
   */
  id: CardId;
  /**
   * The text of the card
   */
  text: string;
  /**
   * The type of the card
   */
  type: 'attribute' | 'word' | 'context';
  /**
   * The level of the card
   */
  level: number;
  /**
   * If the topic comes from its original source
   */
  og?: boolean;
};

export type DilemmaCard = {
  /**
   * Unique identifier for the card
   */
  id: CardId;
  /**
   * The prompt of the card (usually a prefix)
   */
  prompt: string;
  /**
   * The left option
   */
  left: string;
  /**
   * The right option
   */
  right: string;
  /**
   * Flag indicating if it's nsfw
   */
  nsfw?: boolean;
};

/**
 * Group Question Card
 * Used to build a question with a prefix, number and suffix
 * eg: Name 3 fruits
 * Used for: group-questions
 */
export type GroupQuestionCard = {
  /**
   * Unique identifier for the card
   */
  id: CardId;
  /**
   * The prefix in the question
   */
  prefix: string;
  /**
   * The number in the question
   */
  number: number;
  /**
   * The suffix in the question
   */
  suffix: string;
};

/**
 * Monster Image Orientation data
 * Used for: monster-orientation
 */
export type MonsterImage = {
  /**
   * Unique identifier for the card
   */
  id: string;
  /**
   * The orientation of the card
   */
  orientation: string;
};

/**
 * Movie Card
 * Used for: movies
 */
export type MovieCard = {
  /**
   * Unique identifier for the card
   */
  id: CardId;
  /**
   * The prefix of the title of the movie
   */
  prefix: string;
  /**
   * The suffix of the title of the movie
   */
  suffix: string;
};

/**
 * Movie Review Card
 * Used for: movie-reviews
 */
export type MovieReviewCard = {
  /**
   * Unique identifier for the card
   */
  id: CardId;
  /**
   * the text of the card
   */
  text: string;
  /**
   * The type of review
   */
  type: 'good' | 'bad';
  /**
   * The parts of the text that should be highlighted
   */
  highlights?: string[];
};

/**
 * Naming Prompt Card
 * Card with a prompt to name something specific
 * eg: Name an animal
 * Used for: naming-prompts
 */
export type NamingPromptCard = {
  /**
   * Unique identifier for the card
   */
  id: CardId;
  /**
   * the text of the card
   */
  text: string;
  /**
   * The set the card comes from
   */
  set: string;
  /**
   *
   */
  level: number;
};

export type ObjectFeatureCard = {
  /**
   * Unique identifier for the card
   */
  id: CardId;
  /**
   * The text of the feature
   */
  title: DualLanguageValue;
  /**
   * The description of the feature
   */
  description: DualLanguageValue;
  /**
   * The level of difficulty
   */
  level: number;
};

/**
 * Quantitative Question Card
 * Used for: quantitative-questions
 */
export type QuantitativeQuestionCard = {
  /**
   * Unique identifier for the card
   */
  id: CardId;
  /**
   * The question of the card
   */
  question: string;
  /**
   * Flag indicating if the question refers to a range from 0 to 100
   */
  scale?: boolean;
};

/**
 * Spectrum Card
 * eg: Hot - Cold
 * Used for: spectrums
 */
export type SpectrumCard = {
  /**
   * Unique identifier for the card
   */
  id: CardId;
  /**
   * The left side of the spectrum (usually negative)
   */
  left: string;
  /**
   * The right side of the spectrum (usually positive)
   */
  right: string;
};

/**
 * Spy Location Card
 * Use for: spy-locations
 */
export type SpyLocation = {
  /**
   * Unique identifier for the card
   */
  id: CardId;
  /**
   * The name of the location
   */
  name: string;
  /**
   * The list of roles belonging to the location
   */
  roles: string[];
};

/**
 * Suspect Card
 * Used for: suspects
 */
export type SuspectCard = {
  /**
   * Unique identifier for the card
   */
  id: CardId;
  /**
   * The name of the suspect
   */
  name: DualLanguageValue;
  /**
   * The gender of the suspect
   */
  gender: 'male' | 'female' | (string & NonNullable<unknown>);
  /**
   * The ethnicity of the suspect
   */
  ethnicity:
    | 'caucasian'
    | 'black'
    | 'asian'
    | 'latino'
    | 'indian'
    | 'middle-eastern'
    | 'mixed'
    | 'indigenous'
    | (string & NonNullable<unknown>);
  /**
   * The age range of the suspect
   */
  age:
    | '18-21'
    | '21-30'
    | '30-40'
    | '40-50'
    | '50-60'
    | '60-70'
    | '70-80'
    | '80-90'
    | (string & NonNullable<unknown>);
  /**
   * The build of the suspect
   */
  build: 'thin' | 'average' | 'large' | 'muscular' | (string & NonNullable<unknown>);
  /**
   * The height of the suspect
   */
  height: 'short' | 'medium' | 'tall' | (string & NonNullable<unknown>);
  /**
   * List of features in the suspect image (gb style as reference)
   */
  features: string[];
  /**
   * Flag indicating if the suspect is exclusive to the gb style
   */
  gbExclusive?: boolean;
  /**
   * Short description note of the suspect
   */
  note?: string;
  /**
   * AI prompt descritor
   */
  prompt?: string;
};

export type SuspectStyleVariant = 'gb' | 'rl' | 'px' | 'fx' | (string & NonNullable<unknown>);

/**
 * Testimony Question Card
 * Used for: testimony-questions
 */
export type TestimonyQuestionCard = {
  /**
   * Unique identifier for the card
   */
  id: CardId;
  /**
   * The testimony question text
   */
  question: string;
  /**
   * The testimony question in a form of a statement (that needs to be prefixed with a third person pronoun)
   */
  answer: string;
  /**
   * Flag indicating if it's nsfw
   */
  nsfw?: boolean;
};

/**
 * Thing Prompt Card to usually name something
 * Used for: things-qualities
 */
export type ThingPromptCard = {
  /**
   * Unique identifier for the card
   */
  id: CardId;
  /**
   * The text of the card
   */
  text: string;
  /**
   * Optional description to clarify the text
   */
  description?: string;
};

/**
 * Topic Card
 * Used for: topics
 */
export type TopicCard = {
  /**
   * Unique identifier for the card
   */
  id: CardId;
  /**
   * The topic label
   */
  label: string;
  /**
   * The topic category
   */
  category: string;
  /**
   * The level of difficulty
   */
  level: number;
  /**
   * Flag indicating if it's nsfw
   */
  nsfw?: boolean;
};

/**
 * Tweet Card
 * Used for: tweets
 */
export type Tweet = {
  /**
   * Unique identifier for the card
   */
  id: CardId;
  /**
   * the text of the card
   */
  text: string;
};

/**
 * Unique identifier for an item.
 */
export type ItemId = string;

/**
 * Item Card
 * Used for: items
 */
export type Item = {
  /**
   * Unique identifier for the item
   */
  id: ItemId;
  /**
   * The name of the item
   */
  name: DualLanguageValue;
  /**
   * The groups the item can be used in
   */
  decks?: string[];
  /**
   * Flag indicating if it's nsfw
   */
  nsfw?: boolean;
  /**
   * Other names for the item in English
   */
  aliasesEn?: string[];
  /**
   * Other names for the item in Portuguese
   */
  aliasesPt?: string[];
};

/**
 * Item Atributes Values
 */
export type ItemAttributesValues = {
  /**
   * Unique identifier for the item
   */
  id: ItemId;
  /**
   * The dictionary of ItemAttribute id and their values
   */
  attributes: Record<string, -10 | -3 | -1 | 5 | 10 | (number & NonNullable<unknown>)>;
  /**
   * Indicates if all attributes have been assigned numbers
   */
  complete?: boolean;
  /**
   * The timestamp of the last update
   */
  updatedAt?: number;
  /**
   * The alien message using prefixes and attribute keys (only available if the item is complete)
   * (^) -10, (!) -3, (~) -1, (+) 5, (*) 10
   */
  signature?: string;
  /**
   * The percentage of non-unclear attribute values
   */
  reliability?: number;
  /***
   * The value of the absolute extreme opposite and all positive values in attributes
   */
  score?: number;
};

/**
 * Item Attribute
 */
export type ItemAttribute = {
  /**
   * Unique identifier for the attribute (first 3 letters)
   */
  id: string;
  /**
   * The name of the attribute
   */
  name: DualLanguageValue;
  /**
   * The description of the attribute
   */
  description: DualLanguageValue;
  /**
   * The level of difficulty
   */
  level: number;
  /**
   * Priority value when sorting ties (opposite attributes share the same priority)
   */
  priority: number;
  /**
   * The sprite id of the attribute
   */
  spriteId: string;
  /**
   * Present on the original game
   */
  default?: boolean;
  /**
   * Used for attributes that only accept yes/no (unclear) values (-3, -1, 5)
   */
  limited?: boolean;
  /**
   * Used for attributes who are a subset of others or very specific
   */
  specific?: boolean;
  /**
   * Flag indicating another attribute that is directly the opposite of this one
   */
  oppositeId?: string;
  /**
   * Flag indicating another attribute that is a super set of this one and confusing in the same context
   */
  relatedId?: string;
  /**
   * Keywords string to help with search
   */
  keywords: string;
};

export type ItemGroup = {
  /**
   * Unique identifier for the group
   */
  id: string;
  /**
   * The name of the group
   */
  name: DualLanguageValue;
  /**
   * The items in the group
   */
  itemsIds: string[];
  /**
   * Keywords to search for the group
   */
  keywords: string;
  /**
   * Flag indicating if it's nsfw (usually if more than 30% of its items are nsfw)
   */
  nsfw?: boolean;
};

export type DailyDiscSet = {
  /**
   * The id (the setId in the library OR the date in a daily game)
   */
  id: string;
  /**
   * The title of the set
   */
  title: DualLanguageValue;
  /**
   * The items in the set
   */
  itemsIds: ItemId[];
};

export type DailyMovieSet = {
  /**
   * The id (the setId in the library OR the date in a daily game)
   */
  id: string;
  /**
   * The title of the set
   */
  title: string;
  /**
   * The items in the set
   */
  itemsIds: ItemId[];
  /**
   * The release year of the movie
   */
  year: number;
};

export type DailyQuartetSet = {
  /**
   * The id (the setId in the library OR the date in a daily game)
   */
  id: string;
  /**
   * The title of the set
   */
  title: string;
  /**
   * The items in the set
   */
  itemsIds: ItemId[];
  /**
   * The level of difficulty of the set
   */
  level: number;
  /**
   * The type of quartet (visual, word, general, meaning)
   */
  type?: string;
  /**
   * Indicating that something must be done with the set
   */
  flagged?: boolean;
};

export type DailyDiagramRule = {
  /**
   * The id (the setId in the library OR the date in a daily game)
   */
  id: string;
  /**
   * The title of the set
   */
  title: string;
  /**
   * The level of difficulty of the set
   */
  level: number;
  /**
   * The type of rules
   */
  type: string;
  /**
   * Indicates  how a rule is verified
   */
  method: 'auto' | 'manual' | 'dependency';
  /**
   * The date in milliseconds the rule was last updated
   */
  updatedAt: DateMilliseconds;
};

export type DailyDiagramItem = {
  /**
   * The item id
   */
  itemId: string;
  /**
   * The set name of the item
   * (if changed, the rules must be re-checked)
   */
  name: string;
  /**
   * Word separated in syllables with : as a separator
   * e.g. "alien" -> "a:li:en"
   */
  syllables?: string;
  /**
   * The stressed syllable in the word
   * 0 is the last syllable, 1 is the second to last, etc.
   */
  stressedSyllable?: number;
  /**
   * The list of rules the item agrees with
   */
  rules: string[];
  /**
   * The date in milliseconds the rule was last updated
   */
  updatedAt: DateMilliseconds;
};

type MovieGender = {
  /**
   * Unique identifier for the card
   */
  id: string;
  /**
   * The name of the genre
   */
  name: DualLanguageValue;
  /**
   * The additive rating level (to determine the audience rating)
   */
  rating: number;
  /**
   * Lists of roles this genre requires
   */
  rolesIds: string[];
};

type MovieSubGenre = {
  /**
   * Unique identifier for the card
   */
  id: string;
  /**
   * The name of the subgenre
   */
  name: DualLanguageValue;
  /**
   * The additive rating level (to determine the audience rating)
   */
  rating: number;
  /**
   * Lists of roles this sub-genre might have
   */
  rolesIds: string[];
};

type MovieRole = {
  /**
   * Unique identifier for the card
   */
  id: string;
  /**
   * The name of the role
   */
  title: DualLanguageValue;
  /**
   * The description of the role
   */
  description: DualLanguageValue;
  /**
   * The level of complexity of the role (how many starting traits it requires 1-3)
   */
  complexity: number;
  /**
   * The number of actors that would audition to this role
   */
  pool: number;
  /**
   * The type of role (main, supporting, extra) for iconography purposes
   */
  type: string;
};

type MovieFeature = {
  /**
   * Unique identifier for the card
   */
  id: string;
  /**
   * The name of the feature
   */
  name: DualLanguageValue;
  /**
   * The probability of the feature appearing in the movie (percentage 0-100)
   */
  probability: number;
  /**
   * The additive rating level (to determine the audience rating) (may be negative)
   */
  rating: number;
};

export type MovieGenres = {
  genres: Record<string, MovieGender>;
  subGenres: Record<string, MovieSubGenre>;
  roles: Record<string, MovieRole>;
  features: Record<string, MovieFeature>;
};

/**
 * Teenage Student Card
 */
export type TeenageStudent = {
  /**
   * Unique identifier for the card
   */
  id: string;
  /**
   * The title of the teenager
   */
  title: DualLanguageValue;
  /**
   * The name of the teenager
   */
  name: DualLanguageValue;
  /**
   * The social group the student belongs to
   */
  socialGroupId: string;
  /**
   * The gender of the teenager (male, female, both)
   **/
  gender: string;
  /**
   * the teenager ethnicity (white, black, asian, mixed, latino, etc...)
   */
  ethnicity: string;
  /**
   * The teenager's age range ("freshman", "sophomore", "junior", "senior")
   */
  age: string;
  /**
   * The teenager's build ("small", "medium", "large")
   */
  build: string;
  /**
   * The teenager's height ("short", "medium", "tall")
   */
  height: string;
};

/**
 * Teenage Rumor Card
 */
export type TeenageRumor = {
  /**
   * Unique identifier for the card
   */
  id: string;
  /**
   * The text of the rumor
   */
  text: DualLanguageValue;
  /**
   * If the rumour is exclusive to a student type
   */
  exclusive: string;
};

/**
 * Teenage Motivation Card
 */
export type TeenageMotivation = {
  /**
   * Unique identifier for the card
   */
  id: string;
  /**
   * The title of the motivation
   */
  title: DualLanguageValue;
  /**
   * The description of the motivation
   */
  description: DualLanguageValue;
  /**
   * Indication if the motivation is a beginner one
   */
  beginner?: boolean;
};

/**
 * Represents an entry of a drawing.
 */
export type DrawingEntry = {
  /**
   * The unique identifier of the drawing entry (format: "<cardId>;;<artistId>;;<timestamp>").
   */
  id: string;
  /**
   * The drawing content (a stringified JSON array of points).
   */
  drawing: string;
  /**
   * The timestamp when the drawing was created, in milliseconds.
   */
  createdAt: DateMilliseconds;
  /**
   * The unique identifier of the artist who created the drawing.
   */
  artistId: string;
};

/**
 * TDR Drawing Data
 */
export type DrawingData = {
  /**
   * The unique identifier of the card. (same as ArteRuimCard.id).
   */
  id: CardId;
  /**
   * The text of the card. (same as ArteRuimCard.text).
   */
  text: string;
  /**
   * The list of drawing entries for the card.
   */
  drawings: DrawingEntry[];
  /**
   * The timestamp when the drawing was last updated, in milliseconds.
   */
  updatedAt: DateMilliseconds;
};

/**
 * Image Cards Descriptor
 */
export type ImageCardDescriptor = {
  /**
   * Unique identifier for the card
   */
  id: string;
  /**
   * List of keywords/tags related to the image
   */
  keywords: string[];
  /**
   * Flag indicating an outstanding card
   */
  favorite?: boolean;
  /**
   * List of triggers present in the image (credo)
   */
  triggers?: string[];
  /**
   * Card ids from the theme-words deck associated with the image
   */
  associatedDreams?: string[];
};

export type ImageCardPasscodeSet = {
  /**
   * Unique identifier for the card
   */
  id: string;
  /**
   * List of passcode for the cards, it should be order from easier to harder
   */
  passcode: string[];
  /**
   * Cards related to the passcode. Minimum of 3 cards
   */
  imageCardsIds: string[];
};
