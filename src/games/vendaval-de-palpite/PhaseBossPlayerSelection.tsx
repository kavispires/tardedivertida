// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
// Icons
import { BossIcon } from 'icons/BossIcon';
// Components
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
// Internal
import { useOnSubmitBossPlayerAPIRequest } from './utils/api-requests';
import { VENDAVAL_DE_PALPITE_PHASES } from './utils/constants';
import { StepBossPlayerSelection } from './StepBossPlayerSelection';

export function PhaseBossPlayerSelection({ state, players }: PhaseProps) {
  const { step, setStep, goToNextStep } = useStep(0);

  const onBossPlayerClick = useOnSubmitBossPlayerAPIRequest(setStep);

  return (
    <PhaseContainer phase={state?.phase} allowedPhase={VENDAVAL_DE_PALPITE_PHASES.BOSS_SELECTION}>
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <PhaseAnnouncement
          icon={<BossIcon />}
          title={<Translate pt="O Chefe" en="The Boss" />}
          onClose={goToNextStep}
          currentRound={state?.round?.current}
          duration={10}
          type="block"
        >
          <Instruction>
            <Translate
              pt={
                <>
                  Um jogador deve ser o Chefe que sabe exatamente o que ele quer (a palavra secreta) e os
                  outros serão funcionários na reunião de brainstorm.
                </>
              }
              en={
                <>
                  One player must be the Boss who knows exactly wht they want (the secret word) and the other
                  players will be the employees participating in this brainstorm meeting.
                </>
              }
            />
          </Instruction>
        </PhaseAnnouncement>

        {/* Step 1 */}
        <StepBossPlayerSelection players={players} onBossPlayerClick={onBossPlayerClick} />
      </StepSwitcher>
    </PhaseContainer>
  );
}
