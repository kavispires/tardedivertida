import type { ReactNode } from 'react';
// Ant Design Resources
import { Alert, Flex } from 'antd';
// Types
import type { GamePlayers } from 'types/game';
// Components
import { Translate } from '@components/language/Translate';
import { PlayerAvatarName } from '@components/player/PlayerAvatarName';
import { RuleInstruction } from '@components/text/RuleInstruction';
// Internal
import type { FestaJuninaCard, Play } from '../utils/types';
import { useCustomCardWidth } from '../utils/useCustomCardWidth';
import { KEYWORDS } from '../utils/constants';
import { PlayedCardAnimation } from './PlayedCardAnimation';
import { PlayedCardHighlight } from './Highlights';

type CardEffectWaitingInteractionProps = {
  players: GamePlayers;
  play: Play;
  cardsDict: Dictionary<FestaJuninaCard>;
};

export function CardEffectWaitingInteraction({
  players,
  play,
  cardsDict,
}: CardEffectWaitingInteractionProps) {
  if (!play.cardKey) {
    return null;
  }

  const playedCard = cardsDict[play.cardKey];
  const activePlayer = players[play.actorId];

  const everyPrefix = (
    <Translate
      en="{player} played {card}"
      pt="{player} jogou {card}"
      values={{
        player: <PlayerAvatarName player={activePlayer} />,
        card: (
          <PlayedCardHighlight
            card={playedCard}
            showRank
          />
        ),
      }}
    />
  );

  const content = (
    <Alert
      title={
        <Translate
          en="Something went wrong, no effects to resolve."
          pt="Algo deu errado, nenhum efeito para resolver."
        />
      }
      type="error"
    />
  );

  switch (play.cardKeyword) {
    // RANK 1
    case KEYWORDS.GUESS_RANK:
      return (
        <PlayAreaWithCard playedCard={playedCard}>
          {everyPrefix}
          <Translate
            en="and must choose a player and guess the rank of the card in their hand."
            pt="e deve escolher um jogador e adivinhar o valor da carta na mão dele."
          />
        </PlayAreaWithCard>
      );
    case KEYWORDS.GUESS_NAME: {
      return (
        <PlayAreaWithCard playedCard={playedCard}>
          {everyPrefix}
          <Translate
            en="and must choose a player and guess the name of the card of the card in their hand."
            pt="e deve escolher um jogador e adivinhar o nome da carta na mão dele."
          />
        </PlayAreaWithCard>
      );
    }
    // RANK 2
    case KEYWORDS.PEEK:
      return (
        <PlayAreaWithCard playedCard={playedCard}>
          {everyPrefix}
          <Translate
            en="and must choose a player to take a peek at their card."
            pt="e deve escolher um jogador para dar uma espiada na carta."
          />
        </PlayAreaWithCard>
      );
    case KEYWORDS.PEEK_ASIDE:
      return (
        <PlayAreaWithCard playedCard={playedCard}>
          {everyPrefix}
          <Translate
            en="and must take a peek at the aside cards."
            pt="e deve dar uma espiada nas cartas à parte."
          />
        </PlayAreaWithCard>
      );
    // RANK 3
    case KEYWORDS.COMPARE_HIGHER:
      return (
        <PlayAreaWithCard playedCard={playedCard}>
          {everyPrefix}
          <Translate
            en="and must choose a player to compare the rank of the card in their hand with the card in their hand."
            pt="e deve escolher um jogador para comparar o valor da carta na mão dele com a carta na sua mão."
          />
        </PlayAreaWithCard>
      );
    case KEYWORDS.COMPARE_LOWER:
      return (
        <PlayAreaWithCard playedCard={playedCard}>
          {everyPrefix}
          <Translate
            en="and must choose a player to compare the rank of the card in their hand with the card in their hand."
            pt="e deve escolher um jogador para comparar o valor da carta na mão dele com a carta na sua mão."
          />
        </PlayAreaWithCard>
      );
    // RANK 5
    case KEYWORDS.DISCARD_REDRAW:
      return (
        <PlayAreaWithCard playedCard={playedCard}>
          {everyPrefix}
          <Translate
            en="and must choose a player to discard their card and draw a new one."
            pt="e deve escolher um jogador para descartar a carta na mão dele e comprar uma nova."
          />
        </PlayAreaWithCard>
      );
    // RANK 6
    case KEYWORDS.TRADE_HANDS:
      return (
        <PlayAreaWithCard playedCard={playedCard}>
          {everyPrefix}
          <Translate
            en="and must choose a player to trade hands with."
            pt="e deve escolher um jogador para trocar de mãos."
          />
        </PlayAreaWithCard>
      );
    case KEYWORDS.FORCE_TRADE:
      return (
        <PlayAreaWithCard playedCard={playedCard}>
          {everyPrefix}
          <Translate
            en="and must choose two players to trade hands."
            pt="e deve escolher dois jogadores para trocar de mãos."
          />
        </PlayAreaWithCard>
      );
    case KEYWORDS.TRADE_ASIDE:
      return (
        <PlayAreaWithCard playedCard={playedCard}>
          {everyPrefix}
          <Translate
            en="and must trade their hand with one of the aside cards."
            pt="e deve trocar a carta na mão com uma das cartas à parte."
          />
        </PlayAreaWithCard>
      );

    default:
    // Do nothing;
  }

  return (
    <Flex
      gap={8}
      vertical
      align="center"
    >
      {content}
    </Flex>
  );
}

type PlayAreaWithCardProps = {
  playedCard: FestaJuninaCard;
  children: ReactNode;
};

function PlayAreaWithCard({ playedCard, children }: PlayAreaWithCardProps) {
  const { passiveCardWidth } = useCustomCardWidth();

  return (
    <div className="card-interaction-area">
      <RuleInstruction
        type="event"
        style={{ minWidth: 256, minHeight: passiveCardWidth * 1.5 }}
      >
        {children}
      </RuleInstruction>
      <PlayedCardAnimation
        playedCard={playedCard}
        cardWidth={passiveCardWidth}
        animation="pendulum"
      />
    </div>
  );
}
