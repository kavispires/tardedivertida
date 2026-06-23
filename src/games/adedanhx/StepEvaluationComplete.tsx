// Components
import { HostNextPhaseButton } from '@components/host/HostNextPhaseButton';
import { Translate } from '@components/language/Translate';
import { Step } from '@components/steps/Step';
import { StepTitle } from '@components/text/StepTitle';

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
