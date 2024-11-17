// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
// Utils
import { PHASES } from 'utils/phases';
// Icons
import { LawIcon } from 'icons/LawIcon';
// Components
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { StepSelectPlayer } from 'components/steps/StepSelectPlayer';
// Internal
import { useOnSubmitJudgeAPIRequest } from './utils/api-requests';

export function PhaseJudgeSelection({ players, state }: PhaseProps) {
  const { step, setStep } = useStep();

  const onSubmitJudge = useOnSubmitJudgeAPIRequest(setStep);

  const announcement = (
    <PhaseAnnouncement
      icon={<LawIcon />}
      title={<Translate pt="Quem quer ser o juiz?" en="Who will be the Judge?" />}
      currentRound={state?.round?.current}
      type="overlay"
      duration={4}
    />
  );

  const title = <Translate pt="Quem quer ser o juiz?" en="Who will be the Judge?" />;

  const ruleInstruction = (
    <Translate
      en={
        <>
          The judge will be responsible for evaluating the answers of the players determining where each
          submitted item goes in the Venn diagram.
        </>
      }
      pt={
        <>
          O juiz será responsável por avaliar as respostas dos jogadores determinando onde cada item submetido
          vai no diagrama.
        </>
      }
    />
  );

  return (
    <PhaseContainer phase={state?.phase} allowedPhase={PHASES.TEORIA_DE_CONJUNTOS.JUDGE_SELECTION}>
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <StepSelectPlayer
          players={players}
          announcement={announcement}
          titleProps={{
            children: <>{title}</>,
            white: true,
            size: 'small',
          }}
          ruleInstructionProps={{
            children: <>{ruleInstruction}</>,
            type: 'lore',
          }}
          onSubmitPlayer={(playerId) => onSubmitJudge({ judgeId: playerId })}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
