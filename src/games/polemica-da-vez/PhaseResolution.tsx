import { useState } from 'react';
// Hooks
import { useLanguage } from '../../hooks';
// Resources & Utils
import { PHASES } from '../../utils/phases';
// Components
import {
  Instruction,
  PhaseAnnouncement,
  PhaseContainer,
  Step,
  StepSwitcher,
  Translate,
  Title,
  RankingBoard,
  AdminNextRoundButton,
  ButtonContainer,
} from '../../components';
import { StepResolution } from './StepResolution';
import { Button } from 'antd';

function PhaseReact({ state, players, info }: PhaseProps) {
  const { translate } = useLanguage();
  const [step, setStep] = useState(0);

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.POLEMICA_DA_VEZ.RESOLUTION}>
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <PhaseAnnouncement
          type="review"
          title={translate('Resultado', 'Results')}
          onClose={() => setStep(1)}
          currentRound={state?.round?.current}
        >
          <Instruction>
            <Translate
              pt={
                <>
                  E aí? Será que o assunto bombou?
                  <br />
                  Se você acertou a quantidade de curtidas, você ganha 1 ponto
                </>
              }
              en={
                <>
                  So... did the topic trend?
                  <br />
                  If you guess the correct number of likes, you get 1 point
                </>
              }
            />
          </Instruction>
        </PhaseAnnouncement>

        {/* Step 1 */}
        <Step fullWidth>
          <StepResolution
            players={players}
            customTopic={state.customTopic}
            currentTopic={state.currentTopic}
            totalLikes={state.totalLikes}
            setStep={setStep}
          />
        </Step>

        <Step fullWidth>
          <Title>Ranking</Title>
          <RankingBoard ranking={state.ranking} players={players} />
          <ButtonContainer>
            <Button onClick={() => setStep(1)} ghost>
              <Translate pt="Ver resultado novamente" en="See results again" />
            </Button>
          </ButtonContainer>
          <AdminNextRoundButton round={state.round} />
        </Step>
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseReact;
