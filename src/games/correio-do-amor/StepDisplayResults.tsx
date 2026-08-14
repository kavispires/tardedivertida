import { motion } from 'motion/react';
// Ant Design Resources
import { Flex } from 'antd';
// Types
import type { GamePlayers, GamePlayer } from 'types/game';
// Hooks
import { useCardWidth } from '@hooks/useCardWidth';
// Icons
import { AnimatedWaitingDotsIcon } from '@icons/AnimatedWaitingDotsIcon';
// Components
import { Icon } from '@components/general/Icon';
import { Translate } from '@components/language/Translate';
import { PlayerAvatarName } from '@components/player/PlayerAvatarName';
import { Step, type StepProps } from '@components/steps/Step';
import { RuleInstruction } from '@components/text/RuleInstruction';
import { StepTitle } from '@components/text/StepTitle';
// Internal
import type {
  OngoingEffect,
  Play,
  ResolutionLog,
  SubmitSelectionsPayload,
  FestaJuninaCard,
  SubmitCardPayload,
} from './utils/types';
import { PLAYER_STATUS } from './utils/constants';
import { Summary } from './components/Summary';
import { PlayArea } from './components/PlayArea';
import { DeckExplanation } from './components/DeckExplanation';
import { NonPlayingUserArea, PlayingUserArea, EliminatedUserArea } from './components/UserAreas';
import { CardEffectRuleInstruction } from './components/CardEffectRuleInstruction';
import { CardEffectSelection } from './components/CardEffectSelection';
import { FestaJuninaCardImage } from './components/FestaJuninaCardImage';
import { CardResolutionAnimation } from './components/CardResolutionAnimation';
import { CardResolutionRuleInstruction } from './components/CardResolutionRuleInstruction';

type StepDisplayResultsProps = {
  players: GamePlayers;
  user: GamePlayer;
  cardsDict: Dictionary<FestaJuninaCard>;
  turnOrder: GameOrder;
  gameOrder: GameOrder;
  startingPlayerId: UID;
  discardPile: UID[];
  cardsSetAside: UID[];
  effectKeyword: string | null;
  activePlayerId: UID;
  nextDrawnCardId: UID;
  targetPlayersIds: UID[];
  outcome: string;
  activePlayer: GamePlayer;
  isTheActivePlayer: boolean;
  deck: UID[];
  ongoingEffects: OngoingEffect[];
  play: Play;
  log: ResolutionLog[];
} & Pick<StepProps, 'announcement'>;

export function StepDisplayResults({
  announcement,
  cardsDict,
  user,
  deck,
  turnOrder,
  gameOrder,
  activePlayer,
  players,
  cardsSetAside,
  discardPile,
  nextDrawnCardId,
  isTheActivePlayer,
  ongoingEffects,
  log,
}: StepDisplayResultsProps) {
  const cardWidth = useCardWidth(8, { minWidth: 128 });
  const latestLogEntry = log[0];
  const playedCard = cardsDict?.[latestLogEntry?.playedCardId ?? ''] ?? null;

  console.log(playedCard);

  return (
    <Step
      fullWidth
      announcement={announcement}
    >
      <StepTitle>
        {playedCard.flavorText ?? (
          <Translate
            pt="E o que aconteceu..."
            en="What had happened was..."
          />
        )}
      </StepTitle>

      <CardResolutionRuleInstruction
        players={players}
        logEntry={latestLogEntry}
        cardsDict={cardsDict}
      />

      <Summary
        user={user}
        ongoingEffects={ongoingEffects}
        players={players}
        deck={deck}
        turnOrder={turnOrder}
        activePlayerId={activePlayer.id}
        discardPile={discardPile}
        cardsSetAside={cardsSetAside}
      />

      <PlayArea
        players={players}
        gameOrder={gameOrder}
        activePlayerId={activePlayer.id}
        user={user}
        userArea={
          <>
            {user.hand && user.status !== PLAYER_STATUS.ELIMINATED && !isTheActivePlayer && (
              <NonPlayingUserArea
                cardsDict={cardsDict}
                cardWidth={cardWidth / 2}
                user={user}
              />
            )}

            {user.status === PLAYER_STATUS.ELIMINATED && <EliminatedUserArea user={user} />}
          </>
        }
      >
        <CardResolutionAnimation
          players={players}
          activePlayer={activePlayer}
          cardsSetAside={cardsSetAside}
          ongoingEffects={ongoingEffects}
          cardsDict={cardsDict}
          logEntry={latestLogEntry}
        />
      </PlayArea>

      <DeckExplanation
        cardsDict={cardsDict}
        cardWidth={cardWidth}
      />
    </Step>
  );
}
