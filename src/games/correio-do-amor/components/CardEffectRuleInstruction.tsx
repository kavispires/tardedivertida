// Ant Design Resources
import { Alert } from 'antd';
// Types
import type { GamePlayers, GamePlayer } from 'types/game';
// Components
import { Translate } from '@components/language/Translate';
import { PlayerAvatarName } from '@components/player/PlayerAvatarName';
import { RuleInstruction } from '@components/text/RuleInstruction';
// Internal
import type { FestaJuninaCard, OngoingEffect, Play } from '../utils/types';
import { CardHighlight } from './Highlights';

type CardEffectRuleInstructionProps = {
  players: GamePlayers;
  play: Play;
  activePlayer: GamePlayer;
  cardsSetAside: UID[];
  ongoingEffects: OngoingEffect[];
  cardsDict: Dictionary<FestaJuninaCard>;
};

export function CardEffectRuleInstruction({
  players,
  play,
  activePlayer,
  cardsSetAside,
  ongoingEffects,
  cardsDict,
}: CardEffectRuleInstructionProps) {
  if (!play.activeCardId) {
    return null;
  }

  const playedCard = cardsDict[play.activeCardId];

  let content = (
    <Alert
      title={
        <Translate
          en="Something went wrong, no effects explanation found."
          pt="Algo deu errado, nenhuma explicação de efeito encontrada."
        />
      }
      type="error"
    />
  );

  switch (play.effectKeyword) {
    case 'GUESS_RANK':
      content = (
        <Translate
          en={<> and must choose a player and guess the rank of the card in their hand.</>}
          pt={<> e deve escolher um jogador e adivinhar o valor da carta na mão dele.</>}
        />
      );
      break;
    case 'GUESS_NAME':
      content = (
        <Translate
          en={<> and must choose a player and guess the name of the card in their hand.</>}
          pt={<> e deve escolher um jogador e adivinhar o nome da carta na mão dele.</>}
        />
      );
      break;
    case 'PEEK':
      content = (
        <Translate
          en={<> and will choose a player to take a peek at their hand.</>}
          pt={<> e deve escolher um jogador para dar uma espiada na carta.</>}
        />
      );
      break;
    case 'COMPARE_LOWER':
      content = (
        <Translate
          en={
            <>
              {' '}
              and must choose a player to compare hands, the player with the lower ranked card will be
              eliminated.
            </>
          }
          pt={<> e deve escolher um jogador para comparar as mãos. A carta de menor valor será eliminada.</>}
        />
      );
      break;
    case 'COMPARE_HIGHER':
      content = (
        <Translate
          en={
            <>
              {' '}
              and must choose a player to compare hands, the player with the higher ranked card will be
              eliminated.
            </>
          }
          pt={<> e deve escolher um jogador para comparar as mãos. A carta de maior valor será eliminada.</>}
        />
      );
      break;
    case 'DISCARD_REDRAW':
      content = (
        <Translate
          en={<> and must choose a player (including themselves) to discard their card and draw a new one.</>}
          pt={
            <>
              {' '}
              e deve escolher um jogador (includindo ele(a) mesmo(a)) para descartar a mão e comprar uma nova
              carta.
            </>
          }
        />
      );
      break;
    // case 'GUESS_RANK':
    // case 'GUESS_NAME':
    // case 'PEEK':
    // case 'SWAP_SECRET':
    // case 'COMPARE_LOWER':
    // case 'COMPARE_HIGHER':
    // case 'TRADE_HANDS':
    // case 'FORCE_TRADE':
    default:
    // Do nothing;
  }

  return (
    <RuleInstruction type="event">
      <Translate
        en={
          <>
            <PlayerAvatarName player={activePlayer} /> played{' '}
            <CardHighlight color={playedCard.color}>{playedCard.name}</CardHighlight>
          </>
        }
        pt={
          <>
            <PlayerAvatarName player={activePlayer} /> jogou{' '}
            <CardHighlight color={playedCard.color}>{playedCard.name}</CardHighlight>
          </>
        }
      />
      {content}
    </RuleInstruction>
  );
}
