import { useMemo } from 'react';
// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
// Icons
import { AlienAngry2Icon } from 'icons/AlienAngry2Icon';
import { AlienAngryIcon } from 'icons/AlienAngryIcon';
import { AlienHappyIcon } from 'icons/AlienHappyIcon';
import { AlienNeutralIcon } from 'icons/AlienNeutralIcon';
// Components
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
// Internal
import type { PhaseRevealState, RequestHistoryEntry } from './utils/types';
import { COMUNICACAO_ALIENIGENA_PHASES, ITEM_TYPES } from './utils/constants';
import { StepReveal } from './StepReveal';

export function PhaseReveal({ players, state, user }: PhaseProps<PhaseRevealState>) {
  const [alien, isUserAlien] = useWhichPlayerIsThe('alienId', state, players);

  const { step } = useStep();
  const items = state.items ?? [];
  const latestRequest: RequestHistoryEntry | null = state.requestHistory?.[0] ?? null;

  // biome-ignore lint/correctness/useExhaustiveDependencies: all we need is the latestRequest
  const icon = useMemo(() => {
    if (latestRequest?.offers) {
      let hasCurse = false;
      let hasAsk = false;

      latestRequest.offers.forEach((offer) => {
        if (offer?.objectId) {
          const item = items.find((i) => i.id === offer?.objectId);

          if (item?.type === ITEM_TYPES.CURSE) {
            hasCurse = true;
          } else if (item?.type === ITEM_TYPES.ITEM) {
            hasAsk = true;
          }
        }
      });
      if (hasAsk && hasCurse) {
        return <AlienAngryIcon />;
      }
      if (hasAsk) {
        return <AlienHappyIcon />;
      }
      if (hasCurse) {
        return <AlienAngry2Icon />;
      }
      return <AlienNeutralIcon />;
    }
  }, [latestRequest]);

  const announcement = (
    <PhaseAnnouncement
      icon={icon}
      title={
        <Translate
          pt="E as oferendas foram..."
          en="And the offerings were..."
        />
      }
      currentRound={state?.round?.current}
      type="overlay"
      duration={3}
    />
  );

  return (
    <PhaseContainer
      phase={state?.phase}
      allowedPhase={COMUNICACAO_ALIENIGENA_PHASES.REVEAL}
    >
      <StepSwitcher
        step={step}
        players={players}
      >
        {/* Step 0 */}
        <StepReveal
          announcement={announcement}
          players={players}
          user={user}
          alien={alien}
          isUserAlien={isUserAlien}
          items={state.items}
          attributes={state.attributes}
          startingAttributesIds={state.startingAttributesIds}
          status={state.status}
          wasCurseSelected={state.wasCurseSelected}
          curses={state.curses}
          round={state.round}
          requestHistory={state.requestHistory}
          inquiryHistory={state.inquiryHistory}
          isAlienBot={Boolean(state.alienBot)}
          debugMode={Boolean(state.debugMode)}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
