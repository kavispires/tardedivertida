// Hooks
import { useLanguage, useStep } from 'hooks';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Components

import { StepResolution } from './StepResolution';
import { Button, Space } from 'antd';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { Step, StepSwitcher } from 'components/steps';
import { Instruction, Title } from 'components/text';
import { Translate } from 'components/language';
import { RankingBoard } from 'components/ranking';
import { AdminNextRoundButton } from 'components/admin';

function PhaseReact({ state, players, info }: PhaseProps) {
  const { translate } = useLanguage();
  const { step, goToNextStep, goToPreviousStep } = useStep(0);

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.POLEMICA_DA_VEZ.RESOLUTION}>
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <PhaseAnnouncement
          type="review"
          title={translate('Resultado', 'Results')}
          onClose={goToNextStep}
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

        <StepResolution
          players={players}
          customTopic={state.customTopic}
          currentTopic={state.currentTopic}
          totalLikes={state.totalLikes}
          goToNextStep={goToNextStep}
        />

        <Step fullWidth>
          <Title>Ranking</Title>
          <RankingBoard ranking={state.ranking} players={players} />
          <Space className="space-container" align="center">
            <Button onClick={goToPreviousStep} ghost>
              <Translate pt="Ver resultado novamente" en="See results again" />
            </Button>
          </Space>
          <AdminNextRoundButton round={state.round} />
        </Step>
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseReact;
