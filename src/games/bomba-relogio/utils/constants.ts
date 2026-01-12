export const BOMBA_RELOGIO_PHASES = {
  LOBBY: 'LOBBY',
  SETUP: 'SETUP',
  DECLARATION: 'DECLARATION',
  EXAMINATION: 'EXAMINATION',
  GAME_OVER: 'GAME_OVER',
};

export const BOMBA_RELOGIO_ACTIONS = {
  SUBMIT_DECLARATION: 'SUBMIT_DECLARATION',
  UPDATE_TARGET_PLAYER: 'UPDATE_TARGET_PLAYER',
  SUBMIT_TARGET: 'SUBMIT_TARGET',
};

export const ROLES = {
  AGENT: 'agent',
  TERRORIST: 'terrorist',
};

export const CARD_TYPES = {
  BOMB: 'bomb',
  WIRE: 'wire',
  BLANK: 'blank',
};

export const OUTCOME = {
  START: 'START',
  CONTINUE: 'CONTINUE',
  END: 'END',
  BOMB: 'BOMB',
  TERRORISTS_WIN: 'TERRORISTS_WIN',
  AGENTS_WIN: 'AGENTS_WIN',
} as const;

export const TEMPLATE_PHASES = {
  UNKNOWN: 'UNKNOWN',
} as const;

export const ROLE_IMAGES_NAMES = {
  [ROLES.AGENT]: 'timebomb-agent',
  [ROLES.TERRORIST]: 'timebomb-terrorist',
};

export const CARD_IMAGE_NAMES = {
  [CARD_TYPES.BOMB]: 'timebomb-bomb',
  [CARD_TYPES.WIRE]: 'timebomb-redWire',
  [CARD_TYPES.BLANK]: 'timebomb-blank',
  BACK: 'timebomb-back',
};
