// Hooks
import { useStep } from 'hooks/useStep';
import { useOnSubmitBossPlayerAPIRequest } from './utils/api-requests';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Icons
import { BossIcon } from 'icons/BossIcon';
// Components
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
import { Translate } from 'components/language';
import { StepBossPlayerSelection } from './StepBossPlayerSelection';

function PhaseBossPlayerSelection({ state, players, info }: PhaseProps) {
  const { step, setStep, goToNextStep } = useStep(0);

  const onBossPlayerClick = useOnSubmitBossPlayerAPIRequest(setStep);

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.VENDAVAL_DE_PALPITE.BOSS_SELECTION}>
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <PhaseAnnouncement
          icon={<BossIcon />}
          title={<Translate pt="O Chefe" en="The Boss" />}
          onClose={goToNextStep}
          currentRound={state?.round?.current}
          duration={10}
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

export default PhaseBossPlayerSelection;
