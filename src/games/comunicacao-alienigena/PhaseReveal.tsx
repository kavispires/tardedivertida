import { useMemo } from 'react';
// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
import { useUser } from 'hooks/useUser';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
// Utils
import { PHASES } from 'utils/phases';
// Icons
import { AlienAngryIcon } from 'icons/AlienAngryIcon';
import { AlienHappyIcon } from 'icons/AlienHappyIcon';
import { AlienNeutralIcon } from 'icons/AlienNeutralIcon';
// Components
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
// Internal
import { Item, RequestHistoryEntry } from './utils/types';
import { ITEM_TYPES } from './utils/constants';
import { StepReveal } from './StepReveal';

export function PhaseReveal({ players, state }: PhaseProps) {
  const user = useUser(players, state);
  const [alien, isUserAlien] = useWhichPlayerIsThe('alienId', state, players);

  const { step } = useStep();
  const items: Item[] = state.items ?? [];
  const latestRequest: RequestHistoryEntry | null = state.requestHistory?.[0] ?? null;

  const icon = useMemo(() => {
    if (latestRequest && latestRequest.offers) {
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
      if (hasAsk) {
        return <AlienHappyIcon />;
      }
      if (hasCurse) {
        return <AlienAngryIcon />;
      }
      return <AlienNeutralIcon />;
    }
  }, [latestRequest]); // eslint-disable-line react-hooks/exhaustive-deps

  const announcement = (
    <PhaseAnnouncement
      icon={icon}
      title={<Translate pt="E as oferendas foram..." en="And the offerings were..." />}
      currentRound={state?.round?.current}
      type="overlay"
      duration={3}
    />
  );

  return (
    <PhaseContainer phase={state?.phase} allowedPhase={PHASES.COMUNICACAO_ALIENIGENA.REVEAL}>
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <StepReveal
          players={players}
          user={user}
          alien={alien}
          isUserAlien={isUserAlien}
          items={state.items}
          signs={state.signs}
          announcement={announcement}
          status={state.status}
          wasCurseSelected={state.wasCurseSelected}
          curses={state.curses}
          round={state.round}
          requestHistory={state.requestHistory}
          inquiryHistory={state.inquiryHistory}
          isAlienBot={Boolean(state.alienBot)}
          startingAttributes={state.startingAttributes}
          debugMode={Boolean(state.debugMode)}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
