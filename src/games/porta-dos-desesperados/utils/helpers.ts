// Icons
import { DreamCatcherIcon } from 'icons/DreamCatcherIcon';
import { MagicCandlesIcon } from 'icons/MagicCandlesIcon';
import { MagicDivinationIcon } from 'icons/MagicDivinationIcon';
import { MagicHamsaIcon } from 'icons/MagicHamsaIcon';
import { MagicRunesIcon } from 'icons/MagicRunesIcon';
import { MagicTarotCardsIcon } from 'icons/MagicTarotCardsIcon';
import { MagicVoodooDollIcon } from 'icons/MagicVoodooDollIcon';
// Internal
import { PORTA_DOS_DESESPERADOS_PHASES, TRAPS } from './constants';
import type { TrapEntry } from './types';

export function shouldAnnounceTrap(trap: string, phase: string) {
  // Traps that affect the possessed player
  if (phase === PORTA_DOS_DESESPERADOS_PHASES.BOOK_POSSESSION) {
    return [
      TRAPS.FEWER_PAGES,
      TRAPS.MORE_CLUES,
      TRAPS.NO_PREVIEW,
      TRAPS.SEPIA,
      TRAPS.FADED_DOORS,
      TRAPS.FLIP_BOOK,
    ].includes(trap);
  }

  // Traps that affect all players
  return [
    TRAPS.DOUBLE_MAGIC,
    TRAPS.EXTRA_DOOR,
    TRAPS.CONCEALED_DOOR,
    TRAPS.MORE_CLUES,
    TRAPS.NO_PREVIEW,
    TRAPS.RANDOM_INTERJECTION,
    TRAPS.SECRET_CHOICE,
    TRAPS.SEPIA,
    TRAPS.HALF_TIME,
    TRAPS.BLIND_DOOR,
    TRAPS.VANISHING_DOORS,
    TRAPS.DANCING_DOORS,
    TRAPS.LOCKED_CHOICE,
    TRAPS.FADED_DOORS,
    TRAPS.SHUFFLED_DOORS,
    TRAPS.ORDERED_DOORS,
  ].includes(trap);
}

export function getTrapIcon(icon: TrapEntry['icon']) {
  switch (icon) {
    case 'dreamCatcher':
      return DreamCatcherIcon;
    case 'magicCandles':
      return MagicCandlesIcon;
    case 'magicDivination':
      return MagicDivinationIcon;
    case 'magicHamsa':
      return MagicHamsaIcon;
    case 'magicRunes':
      return MagicRunesIcon;
    case 'magicTarotCards':
      return MagicTarotCardsIcon;
    case 'magicVoodooDoll':
      return MagicVoodooDollIcon;

    default:
      return DreamCatcherIcon;
  }
}
