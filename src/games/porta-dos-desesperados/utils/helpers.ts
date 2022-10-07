// Utils
import { PHASES } from 'utils/phases';
import { TRAPS } from './constants';
// Components
import { DreamCatcherIcon } from 'components/icons/DreamCatcherIcon';
import { MagicCandlesIcon } from 'components/icons/MagicCandlesIcon';
import { MagicTarotCardsIcon } from 'components/icons/MagicTarotCardsIcon';
import { MagicVoodooDollIcon } from 'components/icons/MagicVoodooDollIcon';

export function shouldAnnounceTrap(trap: string, phase: string) {
  if (phase === PHASES.PORTA_DOS_DESESPERADOS.BOOK_POSSESSION) {
    return [TRAPS.FEWER_PAGES, TRAPS.MORE_CLUES, TRAPS.NO_PREVIEW, TRAPS.SEPIA].includes(trap);
  }

  return [
    TRAPS.DOUBLE_MAGIC,
    TRAPS.EXTRA_DOOR,
    TRAPS.CONCEALED_DOOR,
    TRAPS.MORE_CLUES,
    TRAPS.ORDERED_DOORS,
    TRAPS.NO_PREVIEW,
    TRAPS.RANDOM_INTERJECTION,
    TRAPS.SECRET_CHOICE,
    TRAPS.NO_COMMUNICATION,
    TRAPS.SEPIA,
  ].includes(trap);
}

export function getTrapDetails(trap: string) {
  switch (trap) {
    case TRAPS.DOUBLE_MAGIC:
      return {
        TrapIcon: MagicCandlesIcon,
        title: {
          pt: 'A Magia Dúplice',
          en: 'The Double Magic',
        },
        description: {
          pt: 'Nessa rodada, cada porta visitada custa 2 cristais mágicos ao invés de 1.',
          en: 'This round each visited door costs 2 magic crystals instead of 1.',
        },
      };
    case TRAPS.EXTRA_DOOR:
      return {
        TrapIcon: MagicTarotCardsIcon,
        title: {
          pt: 'O Caminho Estendido',
          en: 'The Increased Path',
        },
        description: {
          pt: 'Nessa rodada, 7 portas estão disponíveis a serem entradas.',
          en: 'This round 7 doors can be entered.',
        },
      };
    case TRAPS.FEWER_PAGES:
      return {
        TrapIcon: MagicVoodooDollIcon,
        title: {
          pt: 'A Escolha Minguante',
          en: 'The Waning Choice',
        },
        description: {
          pt: 'O jogador possuído tem apenas 4 opções de páginas para escolher',
          en: 'The possessed players has only 4 page options to choose from',
        },
      };
    case TRAPS.CONCEALED_DOOR:
      return {
        TrapIcon: MagicTarotCardsIcon,
        title: {
          pt: 'A Porta Trancada',
          en: 'The Concealed Door',
        },
        description: {
          pt: 'A porta C não será revelada, mas ela ainda pode ser a porta correta.',
          en: 'The door C will not be revealed but it could still be the correct answer.',
        },
      };
    case TRAPS.MORE_CLUES:
      return {
        TrapIcon: MagicVoodooDollIcon,
        title: {
          pt: 'A Trindade Ilusória',
          en: 'The Illusionary Trinity',
        },
        description: {
          pt: 'O jogador possuído deve escolher exatamente 3 páginas do livro.',
          en: 'The possessed player must choose exactly 3 book pages.',
        },
      };
    case TRAPS.NO_PREVIEW:
      return {
        TrapIcon: MagicTarotCardsIcon,
        title: {
          pt: 'O Livreto Diminuto',
          en: 'The Little Booklet',
        },
        description: {
          pt: 'Páginas não podem ser ampliadas.',
          en: 'Expanding/Zooming in cards is not available this round.',
        },
      };
    case TRAPS.ORDERED_DOORS:
      return {
        TrapIcon: MagicTarotCardsIcon,
        title: {
          pt: 'ORDERED_DOORS',
          en: 'ORDERED_DOORS',
        },
        description: {
          pt: 'ORDERED_DOORS',
          en: 'ORDERED_DOORS',
        },
      };
    case TRAPS.RANDOM_INTERJECTION:
      return {
        TrapIcon: MagicTarotCardsIcon,
        title: {
          pt: 'O Intruso',
          en: 'The Deceiving Intruder',
        },
        description: {
          pt: 'Nessa rodada, uma página aleatória será adicionada às páginas do jogador possuído e vocês não saberão qual é a pra ignorar.',
          en: "This round, one page will be randomly added to the possessed player's selected pages and you will not know which one you are supposed to ignore.",
        },
      };
    case TRAPS.SECRET_CHOICE:
      return {
        TrapIcon: MagicTarotCardsIcon,
        title: {
          pt: 'A Escolha Secreta',
          en: 'The Secret Choice',
        },
        description: {
          pt: 'Nessa rodada, jogadores podem discutir, mas o voto é secreto.',
          en: 'This round, players may discuss but their selection is secret.',
        },
      };
    case TRAPS.NO_COMMUNICATION:
      return {
        TrapIcon: MagicTarotCardsIcon,
        title: {
          pt: 'A Voz Silenciosa',
          en: 'The Silence Voice',
        },
        description: {
          pt: 'Jogadores não podem se comunicar e devem analisar e votar em silêncio.',
          en: 'Players can NOT communicate and must make their analysis and decision in silence',
        },
      };
    case TRAPS.SEPIA:
      return {
        TrapIcon: MagicTarotCardsIcon,
        title: {
          pt: 'O Livro Ancião',
          en: 'The Ancient Pages',
        },
        description: {
          pt: 'As páginas do livro estão desbotadas e sem cor.',
          en: 'The Book Pages are old and do not have color.',
        },
      };
    case TRAPS.HALF_TIME:
      return {
        TrapIcon: MagicTarotCardsIcon,
        title: {
          pt: 'O Ansiosa Decisão',
          en: 'The Rush Decision',
        },
        description: {
          pt: 'Jogadores tem que decidir qual porta visitar na metade do tempo.',
          en: 'Players have half the time to decide what door to enter',
        },
      };
    default:
      return {
        TrapIcon: DreamCatcherIcon,
        title: {
          pt: 'Nada',
          en: 'Nothing',
        },
        description: {
          pt: 'Não há nenhuma armadilha nessa rodada... ufa.',
          en: 'No trap was set this round... phew.',
        },
      };
  }
}
