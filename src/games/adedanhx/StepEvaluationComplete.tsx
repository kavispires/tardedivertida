// Components
import { HostNextPhaseButton } from 'components/host';
import { Translate } from 'components/language';
import { Step } from 'components/steps';
import { StepTitle } from 'components/text';
// Types
// Utils

export function StepEvaluationComplete() {
  return (
    <Step fullWidth>
      <StepTitle>
        <Translate
          pt={<>Avaliação completa! Quem ganhou mais pontos nessa rodada?</>}
          en={<>Evaluation complete! Who scored the most points this round?</>}
        />
      </StepTitle>

      <HostNextPhaseButton
        autoTriggerTime={6}
        withWaitingTimeBar
      />
    </Step>
  );
}
