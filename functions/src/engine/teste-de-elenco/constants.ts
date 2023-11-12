import { MovieRole, MovieGenre } from './types';

export const TESTE_DE_ELENCO_PHASES = {
  LOBBY: 'LOBBY',
  RULES: 'RULES',
  SETUP: 'SETUP',
  MOVIE_GENRE_SELECTION: 'MOVIE_GENRE_SELECTION',
  ACTOR_SELECTION: 'ACTOR_SELECTION',
  RESULT: 'RESULT',
  GAME_OVER: 'GAME_OVER',
};

export const TESTE_DE_ELENCO_ACTIONS = {
  SELECT_MOVIE_GENRE: 'SELECT_MOVIE_GENRE',
  SELECT_ACTOR: 'SELECT_ACTOR',
};

export const TESTE_DE_ELENCO_ACHIEVEMENTS = {
  ALONE_VOTES: 'ALONE_VOTES',
  TOGETHER_VOTES: 'TOGETHER_VOTES',
  MOST_CAST: 'MOST_CAST',
  FEWEST_CAST: 'FEWEST_CAST',
  CONSISTENCY: 'CONSISTENCY',
  CHANGELING: 'CHANGELING',
};

export const PLAYER_COUNTS = {
  MIN: 2,
  MAX: 10,
};

export const MAX_ROUNDS = 15;

export const TOTAL_TRAITS = 5 * (3 + 3); // roles * (initial_traits + max_additional_traits)

export const TOTAL_ACTORS = 5 * 12; // roles * pools

export const SMALL_ROLE_REQUIREMENTS = 1;

export const MEDIUM_ROLE_REQUIREMENTS = 2;

export const LARGE_ROLE_REQUIREMENTS = 3;

export const SMALL_ROLE_ACTORS = 8;

export const LARGE_ROLE_ACTORS = 12;

export const MOVIE_GENRES = ['ACTION', 'COMEDY', 'DRAMA', 'HORROR', 'SCI_FI'];

export const ROLES: Record<string, MovieRole> = {
  THE_PROTAGONIST: {
    id: 'THE_PROTAGONIST',
    title: {
      en: 'The Protagonist',
      pt: 'O Protagonista',
    },
    description: {
      en: 'The main character who drives the story forward',
      pt: 'O personagem principal que conduz a história',
    },
    complexity: LARGE_ROLE_REQUIREMENTS,
    pool: LARGE_ROLE_ACTORS,
  },
  THE_ANTAGONIST: {
    id: 'THE_ANTAGONIST',
    title: {
      en: 'The Antagonist',
      pt: 'O Antagonista',
    },
    description: {
      en: 'The character who opposes the protagonist',
      pt: 'O personagem que se opõe ao protagonista',
    },
    complexity: LARGE_ROLE_REQUIREMENTS,
    pool: LARGE_ROLE_ACTORS,
  },
  THE_SIDEKICK: {
    id: 'THE_SIDEKICK',
    title: {
      en: 'The Sidekick',
      pt: 'O Parceiro',
    },
    description: {
      en: 'The character who accompanies the protagonist',
      pt: 'O personagem que acompanha o protagonista',
    },
    complexity: MEDIUM_ROLE_REQUIREMENTS,
    pool: SMALL_ROLE_ACTORS,
  },
  THE_FRIEND: {
    id: 'THE_FRIEND',
    title: {
      en: 'The Friend',
      pt: 'A Amiga/O Amigo',
    },
    description: {
      en: 'The character who accompanies the protagonist',
      pt: 'O personagem que acompanha o protagonista',
    },
    complexity: MEDIUM_ROLE_REQUIREMENTS,
    pool: SMALL_ROLE_ACTORS,
  },
  THE_MENTOR: {
    id: 'THE_MENTOR',
    title: {
      en: 'The Mentor',
      pt: 'O Mentor',
    },
    description: {
      en: 'The character who guides the protagonist through their journey',
      pt: 'O personagem que guia o protagonista em sua jornada',
    },
    complexity: MEDIUM_ROLE_REQUIREMENTS,
    pool: SMALL_ROLE_ACTORS,
  },
  THE_LOVE_INTEREST: {
    id: 'THE_LOVE_INTEREST',
    title: {
      en: 'The Love Interest',
      pt: 'O Interesse Amoroso',
    },
    description: {
      en: 'The character who the protagonist is romantically interested in',
      pt: 'O personagem por quem o protagonista está romanticamente interessado',
    },
    complexity: MEDIUM_ROLE_REQUIREMENTS,
    pool: SMALL_ROLE_ACTORS,
  },
  THE_COMIC_RELIEF: {
    id: 'THE_COMIC_RELIEF',
    title: {
      en: 'The Comic Relief',
      pt: 'O Alívio Cômico',
    },
    description: {
      en: 'The character who provides comic relief',
      pt: 'O personagem que fornece alívio cômico',
    },
    complexity: SMALL_ROLE_REQUIREMENTS,
    pool: SMALL_ROLE_ACTORS,
  },
  THE_SPECIAL_GUEST: {
    id: 'THE_SPECIAL_GUEST',
    title: {
      en: 'The Special Guest',
      pt: 'O Convidado Especial',
    },
    description: {
      en: 'The character who makes a special appearance',
      pt: 'O personagem que faz uma aparição especial',
    },
    complexity: SMALL_ROLE_REQUIREMENTS,
    pool: SMALL_ROLE_ACTORS,
  },
  THE_FIRST_TO_DIE: {
    id: 'THE_FIRST_TO_DIE',
    title: {
      en: 'The Special Guest',
      pt: 'O Convidado Especial',
    },
    description: {
      en: 'The one who dies in the opening scene',
      pt: 'O personagem que morre na cena de abertura',
    },
    complexity: SMALL_ROLE_REQUIREMENTS,
    pool: SMALL_ROLE_ACTORS,
  },
  THE_NARRATOR: {
    id: 'THE_NARRATOR',
    title: {
      en: 'The Narrator',
      pt: 'O Narrador',
    },
    description: {
      en: 'The character who narrates the story',
      pt: 'O personagem que narra a história',
    },
    complexity: SMALL_ROLE_REQUIREMENTS,
    pool: SMALL_ROLE_ACTORS,
  },
  THE_EXTRA: {
    id: 'THE_EXTRA',
    title: {
      en: 'The Extra',
      pt: 'O Figurante',
    },
    description: {
      en: 'The character who appears in the background',
      pt: 'O personagem que aparece no fundo',
    },
    complexity: SMALL_ROLE_REQUIREMENTS,
    pool: SMALL_ROLE_ACTORS,
  },
  THE_EYE_CANDY: {
    id: 'THE_EYE_CANDY',
    title: {
      en: 'The Eye Candy',
      pt: 'O(a) Bonitão(Gata)',
    },
    description: {
      en: 'The character who just looks good in bathing suits',
      pt: 'O personagem que fica bem de sunga/biquíni',
    },
    complexity: SMALL_ROLE_REQUIREMENTS,
    pool: SMALL_ROLE_ACTORS,
  },
};

export const GENRES: Record<string, MovieGenre> = {
  ACTION: {
    id: 'ACTION',
    title: {
      en: 'Action',
      pt: 'Ação',
    },
    roles: [
      ROLES.THE_PROTAGONIST,
      ROLES.THE_ANTAGONIST,
      ROLES.THE_SIDEKICK,
      ROLES.THE_LOVE_INTEREST,
      ROLES.THE_MENTOR,
    ],
  },
  COMEDY: {
    id: 'COMEDY',
    title: {
      en: 'Comedy',
      pt: 'Comédia',
    },
    roles: [
      ROLES.THE_PROTAGONIST,
      ROLES.THE_ANTAGONIST,
      ROLES.THE_LOVE_INTEREST,
      ROLES.THE_EYE_CANDY,
      ROLES.THE_COMIC_RELIEF,
    ],
  },
  DRAMA: {
    id: 'DRAMA',
    title: {
      en: 'Drama',
      pt: 'Drama',
    },
    roles: [
      ROLES.THE_PROTAGONIST,
      ROLES.THE_LOVE_INTEREST,
      ROLES.THE_ANTAGONIST,
      ROLES.THE_NARRATOR,
      ROLES.THE_EXTRA,
    ],
  },
  HORROR: {
    id: 'HORROR',
    title: {
      en: 'Horror',
      pt: 'Terror',
    },
    roles: [
      ROLES.THE_PROTAGONIST,
      ROLES.THE_ANTAGONIST,
      ROLES.THE_MENTOR,
      ROLES.THE_FRIEND,
      ROLES.THE_FIRST_TO_DIE,
    ],
  },
  SCI_FI: {
    id: 'SCI_FI',
    title: {
      en: 'Sci-Fi',
      pt: 'Ficção Científica',
    },
    roles: [
      ROLES.THE_PROTAGONIST,
      ROLES.THE_ANTAGONIST,
      ROLES.THE_COMIC_RELIEF,
      ROLES.THE_SPECIAL_GUEST,
      ROLES.THE_MENTOR,
    ],
  },
};
