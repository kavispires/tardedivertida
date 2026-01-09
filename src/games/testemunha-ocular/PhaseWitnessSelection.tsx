// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
// Icons
import { CrimeSceneIcon } from 'icons/CrimeSceneIcon';
// Components
import { Translate } from 'components/language';
import { PlayersHighlight } from 'components/metrics/PlayersHighlight';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { StepSelectPlayer } from 'components/steps/StepSelectPlayer';
import { Instruction } from 'components/text';
// Internal
import { useOnSelectWitnessAPIRequest } from './utils/api-requests';
import { TESTEMUNHA_OCULAR_PHASES } from './utils/constants';
import type { PhaseWitnessSelectionState } from './utils/types';

function PhaseWitnessSelection({ state, players }: PhaseProps<PhaseWitnessSelectionState>) {
  const { step } = useStep(0);
  const suspectCount = state?.suspectsIds.length ?? '?';

  const onWitnessButtonClick = useOnSelectWitnessAPIRequest();

  const announcement = (
    <PhaseAnnouncement
      icon={<CrimeSceneIcon />}
      title={
        <Translate
          pt="O Caso"
          en="The Case"
        />
      }
      currentRound={state?.round?.current}
      type="overlay"
    >
      <Instruction>
        <Translate
          pt={
            <>
              Um crime horrível aconteceu. Tão horrível quem não consigo nem explicar e nem podemos contar com
              a ciência forense para resolvê-lo. Portanto, só há uma pessoa que pode nos ajudar agora: uma
              testemunha ocular...
            </>
          }
          en={
            <>
              A horrible crime has happened. So horrible that I can't even explain, neither can't rely on
              forensics and science to solve it. So there's only one person that could help us now: An eye
              witness...
            </>
          }
        />
      </Instruction>
    </PhaseAnnouncement>
  );

  const ruleInstruction = (
    <Translate
      pt={
        <>
          Em Testemunha Ocular, um jogador será a testemunha que presenciou um crime desconhecido. Essa
          testemunha responderá perguntas de sim-ou-não para ajudar os outros jogadores (detetives) a
          liberarem pelo menos um dos <PlayersHighlight>{suspectCount} suspeitos</PlayersHighlight> a cada
          rodada. Você quer ser a testemunha?
        </>
      }
      en={
        <>
          In Eye Witness, a player will be the witness who witnessed an unknown crime. This witness will
          answer yes-or-no questions to help the other players (detectives) to release at least one of the{' '}
          <PlayersHighlight>{suspectCount} suspects</PlayersHighlight>
          each round. Do you want to be the witness?
        </>
      }
    />
  );

  return (
    <PhaseContainer
      phase={state?.phase}
      allowedPhase={TESTEMUNHA_OCULAR_PHASES.WITNESS_SELECTION}
      className="t-phase"
    >
      <StepSwitcher
        step={step}
        players={players}
      >
        {/* Step 0 */}
        <StepSelectPlayer
          players={players}
          announcement={announcement}
          titleProps={{
            children: (
              <Translate
                pt="Quem quer ser a testemunha ocular?"
                en="Who wants to be the eye witness?"
              />
            ),
          }}
          ruleInstructionProps={{
            children: <>{ruleInstruction}</>,
            type: 'lore',
          }}
          onSubmitPlayer={(playerId) => onWitnessButtonClick({ witnessId: playerId })}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseWitnessSelection;
