// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from '@hooks/useStep';
import { useWhichPlayerIsThe } from '@hooks/useWhichPlayerIsThe';
// Icons
import { KnowledgeIcon } from '@icons/KnowledgeIcon';
// Components
import { Translate } from '@components/language/Translate';
import { Surface } from '@components/layout/Surface';
import { PhaseAnnouncement } from '@components/phases/PhaseAnnouncement';
import { PhaseContainer } from '@components/phases/PhaseContainer';
import { PlayerAvatarName } from '@components/player/PlayerAvatarName';
import { StepSwitcher } from '@components/steps/StepSwitcher';
import { ViewIf } from '@components/views/ViewIf';
// Internal
import { useOnSubmitSecretWordAPIRequest } from './utils/api-requests';
import { VENDAVAL_DE_PALPITE_PHASES } from './utils/constants';
import { StepSecretWordSelection } from './StepSecretWordSelection';
import { StepWaiting } from './StepWaiting';

export function PhaseSecretWordSelection({ state, players }: PhaseProps) {
  const { step, setStep, goToNextStep } = useStep(0);
  const [boss, isUserTheBoss] = useWhichPlayerIsThe('bossId', state, players);

  const onSubmitSecretWord = useOnSubmitSecretWordAPIRequest(setStep);

  return (
    <PhaseContainer
      phase={state?.phase}
      allowedPhase={VENDAVAL_DE_PALPITE_PHASES.SECRET_WORD_SELECTION}
    >
      <StepSwitcher
        step={step}
        players={players}
      >
        {/* Step 0 */}
        <PhaseAnnouncement
          icon={<KnowledgeIcon />}
          title={
            <Translate
              pt="A Palavra Secreta"
              en="The Secret Word"
            />
          }
          onClose={goToNextStep}
          currentRound={state?.round?.current}
          duration={5}
          type="block"
        >
          <Surface>
            <Translate
              pt="O chefe {boss} escolherá a palavra-secreta e sua categoria."
              en="The boss {boss} will choose the secret clue and its category."
              values={{ boss: <PlayerAvatarName player={boss} /> }}
            />
          </Surface>
        </PhaseAnnouncement>

        {/* Step 1 */}
        <ViewIf condition={isUserTheBoss}>
          <StepSecretWordSelection
            words={state.words}
            categories={state.categories}
            onSubmitSecretWord={onSubmitSecretWord}
          />
        </ViewIf>
        <ViewIf condition={!isUserTheBoss}>
          <StepWaiting
            players={players}
            instruction={
              <Translate
                pt="O mestre {boss} está escolhendo a palavra-secreta e sua categoria."
                en="The boss {boss} is choosing the secret clue and its category."
                values={{ boss: <PlayerAvatarName player={boss} /> }}
              />
            }
          />
        </ViewIf>
      </StepSwitcher>
    </PhaseContainer>
  );
}
