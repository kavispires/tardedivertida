// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from '@hooks/useStep';
// Icons
import { CrimeSceneIcon } from '@icons/CrimeSceneIcon';
// Components
import { Translate } from '@components/language/Translate';
import { Surface } from '@components/layout/Surface';
import { PlayersHighlight } from '@components/metrics/PlayersHighlight';
import { PhaseAnnouncement } from '@components/phases/PhaseAnnouncement';
import { PhaseContainer } from '@components/phases/PhaseContainer';
import { StepSelectPlayer } from '@components/steps/StepSelectPlayer';
import { StepSwitcher } from '@components/steps/StepSwitcher';
// Internal
import { useOnSelectWitnessAPIRequest } from './utils/api-requests';
import { TESTEMUNHA_OCULAR_PHASES } from './utils/constants';
import type { PhaseWitnessSelectionState } from './utils/types';

export function PhaseWitnessSelection({ state, players }: PhaseProps<PhaseWitnessSelectionState>) {
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
      <Surface>
        <Translate
          pt="
              Um crime horrível aconteceu. Tão horrível quem não consigo nem explicar e nem podemos contar com
              a ciência forense para resolvê-lo. Portanto, só há uma pessoa que pode nos ajudar agora: uma
              testemunha ocular...
            "
          en="
              A horrible crime has happened. So horrible that I can't even explain, neither can't rely on
              forensics and science to solve it. So there's only one person that could help us now: An eye
              witness...
           "
        />
      </Surface>
    </PhaseAnnouncement>
  );

  const ruleInstruction = (
    <Translate
      en="In Eye Witness, a player will be the witness who witnessed an unknown crime. This witness will answer yes-or-no questions to help the other players (detectives) to release at least one of the <suspectCount>suspects</suspectCount> each round. Do you want to be the witness?"
      pt="Em Testemunha Ocular, um jogador será a testemunha que presenciou um crime desconhecido. Essa testemunha responderá perguntas de sim-ou-não para ajudar os outros jogadores (detetives) a liberarem pelo menos um dos <suspectCount>suspeitos</suspectCount> a cada rodada. Você quer ser a testemunha?"
      values={{
        suspectCount: (content) => (
          <PlayersHighlight>
            {suspectCount} {content}
          </PlayersHighlight>
        ),
      }}
    />
  );

  return (
    <PhaseContainer
      phase={state?.phase}
      allowedPhase={TESTEMUNHA_OCULAR_PHASES.WITNESS_SELECTION}
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
