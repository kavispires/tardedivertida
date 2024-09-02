// Types
import type { PhaseProps } from 'types/game';
// State & Hooks
import { useUser } from 'hooks/useUser';
import { useStep } from 'hooks/useStep';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Icons
import { AlienHappyIcon } from 'icons/AlienHappyIcon';
import { AlienAngryIcon } from 'icons/AlienAngryIcon';
import { AlienNeutralIcon } from 'icons/AlienNeutralIcon';
// Components
import { StepSwitcher } from 'components/steps';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { Translate } from 'components/language';
import { StepReveal } from './StepReveal';
import { useMemo } from 'react';
import { Item, RequestHistoryEntry } from './utils/types';
import { ITEM_TYPES } from './utils/constants';

export function PhaseReveal({ players, state, info }: PhaseProps) {
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
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.COMUNICACAO_ALIENIGENA.REVEAL}>
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
