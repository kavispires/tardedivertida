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

export function shouldAnnounceTrap(trap: string, phase: string) {
  if (phase === PORTA_DOS_DESESPERADOS_PHASES.BOOK_POSSESSION) {
    return [TRAPS.FEWER_PAGES, TRAPS.MORE_CLUES, TRAPS.NO_PREVIEW, TRAPS.SEPIA, TRAPS.FADED_DOORS].includes(
      trap,
    );
  }

  return [
    TRAPS.DOUBLE_MAGIC,
    TRAPS.EXTRA_DOOR,
    TRAPS.CONCEALED_DOOR,
    TRAPS.MORE_CLUES,
    TRAPS.NO_PREVIEW,
    TRAPS.RANDOM_INTERJECTION,
    TRAPS.SECRET_CHOICE,
    TRAPS.NO_COMMUNICATION,
    TRAPS.SEPIA,
    TRAPS.HALF_TIME,
    TRAPS.BLIND_DOOR,
    TRAPS.VANISHING_DOORS,
    TRAPS.DANCING_DOORS,
    TRAPS.DELAYING_DOORS,
    TRAPS.LOCKED_CHOICE,
    TRAPS.FADED_DOORS,
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
        TrapIcon: MagicRunesIcon,
        title: {
          pt: 'O Livreto Diminuto',
          en: 'The Little Booklet',
        },
        description: {
          pt: 'Páginas não podem ser ampliadas.',
          en: 'Expanding/Zooming in cards is not available this round.',
        },
      };
    case TRAPS.RANDOM_INTERJECTION:
      return {
        TrapIcon: MagicVoodooDollIcon,
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
    case TRAPS.BLIND_DOOR:
      return {
        TrapIcon: MagicHamsaIcon,
        title: {
          pt: 'A Porta Cega',
          en: 'The Blind Door',
        },
        description: {
          pt: 'Cada jogador não pode ver uma porta aleatória.',
          en: 'Each player cannot see one random door.',
        },
      };
    case TRAPS.DANCING_DOORS:
      return {
        TrapIcon: MagicRunesIcon,
        title: {
          pt: 'As Portas Dançantes',
          en: 'The Dancing Doors',
        },
        description: {
          pt: 'As portas ficam se movendo, possuídas pelo ritmo Ragatanga.',
          en: 'The doors keep moving around.',
        },
      };
    case TRAPS.DELAYING_DOORS:
      return {
        TrapIcon: MagicDivinationIcon,
        title: {
          pt: 'As Portas Atrasadas',
          en: 'The Delaying Doors',
        },
        description: {
          pt: 'Uma porta aparece a cada 30 segundos...',
          en: 'A door appears every 30 seconds...',
        },
      };
    case TRAPS.VANISHING_DOORS:
      return {
        TrapIcon: MagicHamsaIcon,
        title: {
          pt: 'As Portas Desvanecentes',
          en: 'The Vanishing Doors',
        },
        description: {
          pt: 'Um porta some a cada 30 segundos...',
          en: 'A door vanishes every 30 seconds...',
        },
      };
    case TRAPS.LOCKED_CHOICE:
      return {
        TrapIcon: MagicTarotCardsIcon,
        title: {
          pt: 'A Escolha Permanente',
          en: 'The Locked Choice',
        },
        description: {
          pt: 'Jogadores não podem mudar de ideia depois de escolher uma porta.',
          en: 'Players cannot change their mind after selecting a door.',
        },
      };
    case TRAPS.FADED_DOORS:
      return {
        TrapIcon: MagicHamsaIcon,
        title: {
          pt: 'As Portas Enfraquecidas',
          en: 'The Fading Doors',
        },
        description: {
          pt: 'As imagens das portas estão bem fracas e desaparecendo...',
          en: 'The doors are fading...',
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
