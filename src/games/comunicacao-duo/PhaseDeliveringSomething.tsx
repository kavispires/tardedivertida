// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from '@hooks/useStep';
import { useWhichPlayerIsThe } from '@hooks/useWhichPlayerIsThe';
// Icons
import { MysteryBoxIcon } from '@icons/MysteryBoxIcon';
// Components
import { AlienText } from '@components/alien/AlienText';
import { Translate } from '@components/language/Translate';
import { Surface } from '@components/layout/Surface';
import { PhaseAnnouncement } from '@components/phases/PhaseAnnouncement';
import { PhaseContainer } from '@components/phases/PhaseContainer';
import { StepSwitcher } from '@components/steps/StepSwitcher';
import { TextHighlight } from '@components/text/TextHighlight';
import { ViewIf } from '@components/views/ViewIf';
// Internal
import { useOnStopDeliveryAPIRequest, useOnSubmitDeliveryAPIRequest } from './utils/api-requests';
import { COMUNICACAO_DUO_PHASES } from './utils/constants';
import type { PhaseDeliveringSomethingState } from './utils/types';
import { StepDeliver } from './StepDeliver';

export function PhaseDeliveringSomething({
  players,
  state,
  user,
}: PhaseProps<PhaseDeliveringSomethingState>) {
  const { step } = useStep();
  const [requester, isTheRequester] = useWhichPlayerIsThe('requesterId', state, players);

  const onSubmitDelivery = useOnSubmitDeliveryAPIRequest();
  const onStopDelivery = useOnStopDeliveryAPIRequest();

  const latestHistoryEntry = state.history[state.history.length - 1];
  const hasADelivery = latestHistoryEntry.deliverables.length > 0;

  const announcement = (
    <PhaseAnnouncement
      icon={<MysteryBoxIcon />}
      title={
        isTheRequester ? (
          <Translate
            pt="Você pediu!"
            en="You asked for"
          />
        ) : (
          <Translate
            pt="Por favor, me vê aí..."
            en="Please give me..."
          />
        )
      }
      currentRound={state?.round?.current}
      type="overlay"
      duration={3}
    >
      <Surface>
        <ViewIf condition={state.clueInputType === 'alien-keyboard'}>
          <AlienText value={state.clue ?? ''} />
        </ViewIf>
        <ViewIf condition={state.clueInputType !== 'alien-keyboard'}>
          <TextHighlight style={{ fontSize: '1.5rem' }}>{state.clue}</TextHighlight>
        </ViewIf>
      </Surface>
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer
      phase={state?.phase}
      allowedPhase={COMUNICACAO_DUO_PHASES.DELIVER_SOMETHING}
    >
      <StepSwitcher
        step={step}
        players={players}
      >
        {/* Step 0 */}
        <StepDeliver
          user={user}
          players={players}
          announcement={hasADelivery ? undefined : announcement}
          deckType={state.deckType}
          deck={state.deck}
          status={state.status}
          history={state.history}
          requester={requester}
          isTheRequester={isTheRequester}
          summary={state.summary}
          clueInputType={state.clueInputType}
          clue={state.clue}
          clueQuantity={state.clueQuantity}
          onSubmitDelivery={onSubmitDelivery}
          onStopDelivery={onStopDelivery}
          round={state.round}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
