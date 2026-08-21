// Ant Design Resources
import { Alert } from 'antd';
// Types
import type { GamePlayers, GamePlayer } from 'types/game';
// Components
import { Translate } from '@components/language/Translate';
import { PlayerAvatarName } from '@components/player/PlayerAvatarName';
import { RuleInstruction } from '@components/text/RuleInstruction';
// Internal
import type { FestaJuninaCard, OngoingEffect, Play, ResolutionLog } from '../utils/types';
import { CardHighlight, TargetHighlight } from './Highlights';

type CardResolutionAnimationProps = {
  players: GamePlayers;
  // play: Play;
  activePlayer: GamePlayer;
  cardsSetAside: UID[];
  ongoingEffects: OngoingEffect[];
  cardsDict: Dictionary<FestaJuninaCard>;
  logEntry: ResolutionLog;
};

export function CardResolutionAnimation({
  players,
  // play,
  activePlayer,
  // cardsSetAside,
  // ongoingEffects,
  cardsDict,
  logEntry,
}: CardResolutionAnimationProps) {
  const playedCard = cardsDict[logEntry.playedCardId];
  const actor = players[logEntry.actorPlayerId];
  const targets = logEntry.targetPlayersIds.map((id) => players[id]);

  const everyPrefix = (
    <Translate
      en="{player} played {card}!"
      pt="{player} jogou {card}!"
      values={{
        player: <PlayerAvatarName player={activePlayer} />,
        card: <CardHighlight color={playedCard.color}>{playedCard.name}</CardHighlight>,
      }}
    />
  );

  switch (playedCard.keyword) {
    case 'GUESS_RANK':
      return (
        <RuleInstruction type="event">
          {everyPrefix}
          <Translate
            en="and must choose a player and guess the rank of the card in their hand."
            pt="e deve escolher um jogador e adivinhar o valor da carta na mão dele."
          />
        </RuleInstruction>
      );
    case 'GUESS_NAME': {
      const guessedCard = cardsDict[logEntry.effectInput ?? ''];
      return (
        <RuleInstruction type="event">
          <Translate
            en="{player} chose {target} and tried to guess that it was {guessedCard} and it wasn't. Life goes on..."
            pt="{player} escolheu {target} e tentou adivinhar que era {guessedCard} e não era. A vida segue..."
            values={{
              player: <PlayerAvatarName player={activePlayer} />,
              target: (
                <TargetHighlight>
                  <PlayerAvatarName player={targets[0]} />
                </TargetHighlight>
              ),
              guessedCard: <CardHighlight color={guessedCard.color}>{guessedCard.name}</CardHighlight>,
            }}
          />
        </RuleInstruction>
      );
    }
    case 'PEEK':
      return (
        <RuleInstruction type="event">
          {everyPrefix}
          <Translate
            en="and will choose a player to take a peek at their hand."
            pt="e deve escolher um jogador para dar uma espiada na carta."
          />
        </RuleInstruction>
      );
    case 'SWAP_ASIDE':
    case 'COMPARE_LOWER':
      return (
        <RuleInstruction type="event">
          {everyPrefix}
          <Translate
            en=" and must choose a player to compare hands, the player with the lower ranked card will be eliminated."
            pt=" e deve escolher um jogador para comparar as mãos. A carta de menor valor será eliminada."
          />
        </RuleInstruction>
      );
    case 'COMPARE_HIGHER':
      return (
        <RuleInstruction type="event">
          {everyPrefix}
          <Translate
            en=" and must choose a player to compare hands, the player with the higher ranked card will be eliminated."
            pt=" e deve escolher um jogador para comparar as mãos. A carta de maior valor será eliminada."
          />
        </RuleInstruction>
      );

    case 'DISCARD_REDRAW':
    case 'TRADE_HANDS':
    case 'FORCE_TRADE':
    default:
      return (
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
  }
}
