import { loadLocalToday } from 'pages/Daily/utils';
// Utils
import { deepCopy } from 'utils/helpers';
// Internal
import { SETTINGS } from './settings';
import { DailyTeoriaDeConjuntosEntry, GameState, TeoriaDeConjuntosLocalToday } from './types';

export const DEFAULT_LOCAL_TODAY: TeoriaDeConjuntosLocalToday = {
  id: '',
  guesses: [],
  hearts: SETTINGS.HEARTS,
};

export const getInitialState = (data: DailyTeoriaDeConjuntosEntry): GameState => {
  const localToday = loadLocalToday({
    key: SETTINGS.KEY,
    gameId: data.id,
    defaultValue: deepCopy(DEFAULT_LOCAL_TODAY),
  });

  const state: GameState = {
    hearts: SETTINGS.HEARTS,
    win: false,
    hand: data.things.slice(0, 4),
    deck: data.things.slice(4),
    rule1Things: [
      {
        id: data.rule1.thing.id,
        name: data.rule1.thing.name,
        rule: 1,
      },
    ],
    rule2Things: [
      {
        id: data.rule2.thing.id,
        name: data.rule2.thing.name,
        rule: 2,
      },
    ],
    intersectingThings: [
      {
        id: data.intersectingThing.id,
        name: data.intersectingThing.name,
      },
    ],
    activeThing: null,
    activeArea: null,
    guesses: [],
  };

  // Apply local state
  localToday.guesses.forEach((guess) => {
    const activeThing = state.hand.find((t) => t.id === guess.thingId);

    if (activeThing) {
      // Remove it from hand
      state.hand = state.hand.filter((t) => t.id !== guess.thingId);

      // Place it correctly
      if (activeThing.rule === 1) {
        state.rule1Things.push(activeThing);
      } else if (activeThing.rule === 2) {
        state.rule2Things.push(activeThing);
      } else if (activeThing.rule === 0) {
        state.intersectingThings.push(activeThing);
      }

      if (activeThing.rule !== guess.sectionId) {
        if (state.deck.length > 0) {
          state.hand.push(state.deck.pop()!);
        }
      } else {
        if (state.hand.length === 0) {
          state.win = true;
        }
      }
    }
  });

  state.guesses = localToday.guesses ?? state.guesses ?? [];
  state.hearts = localToday.hearts ?? state.hearts ?? SETTINGS.HEARTS;

  return state;
};
