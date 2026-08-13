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

type StepMakeDecisionProps = {
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
  onSubmitSelections: (payload: SubmitSelectionsPayload) => void;
  play: Play;
} & Pick<StepProps, 'announcement'>;

export function StepMakeDecision({
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
  onSubmitSelections,
  play,
}: StepMakeDecisionProps) {
  const cardWidth = useCardWidth(8, { minWidth: 128 });
  const playedCard = cardsDict?.[play?.activeCardId ?? ''] ?? null;

  return (
    <Step
      fullWidth
      announcement={announcement}
    >
      <StepTitle>
        {playedCard ? (
          <Translate
            pt={<>{playedCard.name} está aqui...</>}
            en={<>{playedCard.name} is here</>}
          />
        ) : (
          <Translate
            pt={<>Hora da Decisão</>}
            en={<>Time to Decide</>}
          />
        )}
      </StepTitle>

      <CardEffectRuleInstruction
        players={players}
        play={play}
        activePlayer={activePlayer}
        cardsSetAside={cardsSetAside}
        ongoingEffects={ongoingEffects}
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
            {user.hand && user.status !== PLAYER_STATUS.ELIMINATED && (
              <NonPlayingUserArea
                cardsDict={cardsDict}
                cardWidth={cardWidth / 1.5}
                user={user}
              />
            )}

            {user.status === PLAYER_STATUS.ELIMINATED && <EliminatedUserArea user={user} />}
          </>
        }
      >
        {isTheActivePlayer ? (
          <CardEffectSelection
            players={players}
            play={play}
            user={user}
            cardsSetAside={cardsSetAside}
            ongoingEffects={ongoingEffects}
            cardsDict={cardsDict}
            onSubmitSelections={onSubmitSelections}
          />
        ) : (
          <Flex>
            {playedCard && (
              <motion.div
                animate={{ rotate: [-6, 6, -6] }}
                transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
                style={{ transformOrigin: 'top center' }}
                className="my-5"
              >
                <FestaJuninaCardImage
                  card={playedCard}
                  cardId={playedCard.id}
                  width={cardWidth}
                />
              </motion.div>
            )}
          </Flex>
        )}
      </PlayArea>

      <DeckExplanation
        cardsDict={cardsDict}
        cardWidth={cardWidth}
      />
    </Step>
  );
}
