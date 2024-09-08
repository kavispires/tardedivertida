import { SETTINGS } from './settings';
import { DailyTeoriaDeConjuntosEntry, GameState, TeoriaDeConjuntosLocalToday } from './types';

export const parseLocalToday = (
  localToday: TeoriaDeConjuntosLocalToday,
  data: DailyTeoriaDeConjuntosEntry,
  state: GameState
): GameState => {
  // For every guess in localToday, remove the item from the hand and add it to the diagram
  console.log('guesses', localToday.guesses);
  localToday.guesses?.forEach((guess) => {
    const activeThing = state.hand.find((t) => t.id === guess.thingId);
    console.log('Applying thing', activeThing?.name);
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
        console.log('wrong section');
        if (state.deck.length > 0) {
          state.hand.push(state.deck.pop()!);
        }
      } else {
        console.log('correct section');
        if (state.hand.length === 0) {
          console.log('empty hand');
          state.win = true;
        }
      }
    }
  });

  console.log('win?', state.win);

  return {
    ...state,
    guesses: localToday.guesses ?? state.guesses ?? [],
    hearts: localToday.hearts ?? state.hearts ?? SETTINGS.HEARTS,
  };
};
