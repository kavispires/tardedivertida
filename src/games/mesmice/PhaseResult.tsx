import { ReactNode } from 'react';
// Types
import type { PhaseProps } from 'types/game';
// State & Hooks
import { useUser } from 'hooks/useUser';
import { useStep } from 'hooks/useStep';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Icons
import { ThumbsUpIcon } from 'icons/ThumbsUpIcon';
import { ApplauseIcon } from 'icons/ApplauseIcon';
import { SkullIcon } from 'icons/SkullIcon';
// Components
import { StepSwitcher } from 'components/steps';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { Translate } from 'components/language';
import { StepResult } from './StepResult';

export function PhaseResult({ players, state, info }: PhaseProps) {
  const user = useUser(players, state);
  const { step } = useStep();
  const [activePlayer, isUserTheActivePlayer] = useWhichPlayerIsThe('activePlayerId', state, players);

  const outcome: string = state.outcome;

  const icon: ReactNode = {
    CONTINUE: <ThumbsUpIcon />,
    LOSE: <SkullIcon />,
    WIN: <ApplauseIcon />,
  }[outcome];

  const announcement = (
    <PhaseAnnouncement
      icon={icon}
      title={<Translate pt="Resultado" en="Result" />}
      currentRound={state?.round?.current}
      type="overlay"
      duration={2}
    ></PhaseAnnouncement>
  );

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.MESMICE.RESULT}>
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <StepResult
          user={user}
          players={players}
          features={state.features}
          activePlayer={activePlayer}
          item={state.item}
          clue={state.clue}
          isUserTheActivePlayer={isUserTheActivePlayer}
          history={state.history}
          outcome={outcome}
          votes={state.votes}
          round={state.round}
          announcement={announcement}
          groupScore={state.groupScore}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
