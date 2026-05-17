// Types
import type { GamePlayers, GamePlayer, GameRound } from 'types/game';
// Components
import { TimedButton } from 'components/buttons/TimedButton';
import { HostNextPhaseButton } from 'components/host/HostNextPhaseButton';
import { Translate } from 'components/language/Translate';
import { PlayersTurnOrder } from 'components/players/PlayersTurnOrder';
import { Step, type StepProps } from 'components/steps/Step';
import { StepTitle } from 'components/text/StepTitle';
import { ViewIf } from 'components/views/ViewIf';
// Internal
import type { ClientCard, Teller } from './utils/types';
import { useNextStepDuration } from './utils/hooks';
import { OUTCOME } from './utils/constants';
import { TellerBoard } from './components/TellerBoard';
import { PeopleOrder } from './components/PeopleOrder';
import { MyHand } from './components/MyHand';

type StepAnimatePreviousActionProps = {
  players: GamePlayers;
  user: GamePlayer;
  deckDict: Dictionary<ClientCard>;
  drawDeck: UID[];
  tellers: Dictionary<Teller>;
  activePlayer: GamePlayer;
  goToNextStep: () => void;
  isTheActivePlayer: boolean;
  previousPlayer: GamePlayer;
  cardWidth: number;
  turnOrder: TurnOrder;
  outcome: string;
  round: GameRound;
  isNewRound: boolean;
} & Pick<StepProps, 'announcement'>;

export function StepAnimatePreviousAction({
  announcement,
  players,
  tellers,
  deckDict,
  user,
  drawDeck,
  isTheActivePlayer,
  previousPlayer,
  goToNextStep,
  cardWidth,
  turnOrder,
  outcome,
  round,
  isNewRound,
}: StepAnimatePreviousActionProps) {
  const tellersList = Object.values(tellers);
  const duration = useNextStepDuration(tellersList);

  return (
    <Step
      fullWidth
      announcement={announcement}
    >
      <StepTitle size="medium">
        <ViewIf condition={isNewRound}>
          <Translate
            pt={<>É um novo dia no banco...</>}
            en={<>It's a new day at the bank...</>}
          />
        </ViewIf>

        <ViewIf condition={!isNewRound}>
          {previousPlayer ? (
            <Translate
              pt={<>E isso que acontece...</>}
              en={<>And this is what happens...</>}
            />
          ) : (
            <Translate
              pt={<>É um calmo dia no banco...</>}
              en={<>It's a calm day at the bank...</>}
            />
          )}
        </ViewIf>
      </StepTitle>

      {tellersList.map((teller) => (
        <TellerBoard
          key={`${teller.id}-${previousPlayer?.id}`}
          teller={teller}
          deckDict={deckDict}
          cardWidth={cardWidth}
          animate
        />
      ))}

      {outcome !== OUTCOME.END_ROUND ? (
        <TimedButton
          type="primary"
          duration={duration}
          disabled
          onExpire={() => goToNextStep()}
        >
          <Translate
            pt="Continuando em..."
            en="Continuing in..."
          />
        </TimedButton>
      ) : (
        <HostNextPhaseButton
          withWaitingTimeBar
          autoTriggerTime={12}
          round={round}
        />
      )}

      <MyHand
        user={user}
        deckDict={deckDict}
        isTheActivePlayer={isTheActivePlayer}
        cardWidth={cardWidth}
        drawDeck={drawDeck}
        players={players}
      />

      <PeopleOrder />

      <PlayersTurnOrder
        players={players}
        order={turnOrder}
        activePlayerId={previousPlayer?.id || ''}
      />
    </Step>
  );
}
