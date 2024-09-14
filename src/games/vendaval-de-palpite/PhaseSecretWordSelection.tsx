// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
// Utils
import { PHASES } from 'utils/phases';
// Icons
import { KnowledgeIcon } from 'icons/KnowledgeIcon';
// Components
import { AvatarName } from 'components/avatars';
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
import { ViewOr } from 'components/views';
// Internal
import { useOnSubmitSecretWordAPIRequest } from './utils/api-requests';
import { StepSecretWordSelection } from './StepSecretWordSelection';
import { StepWaiting } from './StepWaiting';

export function PhaseSecretWordSelection({ state, players, info }: PhaseProps) {
  const { step, setStep, goToNextStep } = useStep(0);
  const [boss, isUserTheBoss] = useWhichPlayerIsThe('bossId', state, players);

  const onSubmitSecretWord = useOnSubmitSecretWordAPIRequest(setStep);

  return (
    <PhaseContainer
      info={info}
      phase={state?.phase}
      allowedPhase={PHASES.VENDAVAL_DE_PALPITE.SECRET_WORD_SELECTION}
    >
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <PhaseAnnouncement
          icon={<KnowledgeIcon />}
          title={<Translate pt="A Palavra Secreta" en="The Secret Word" />}
          onClose={goToNextStep}
          currentRound={state?.round?.current}
          duration={5}
          type="block"
        >
          <Instruction>
            <Translate
              pt={
                <>
                  O chefe <AvatarName player={boss} /> escolherá a palavra-secreta e sua categoria.
                </>
              }
              en={
                <>
                  The boss <AvatarName player={boss} /> will choose the secret clue and its category.
                </>
              }
            />
          </Instruction>
        </PhaseAnnouncement>

        {/* Step 1 */}
        <ViewOr condition={isUserTheBoss}>
          <StepSecretWordSelection
            words={state.words}
            categories={state.categories}
            onSubmitSecretWord={onSubmitSecretWord}
          />

          <StepWaiting
            players={players}
            instruction={
              <Translate
                pt={
                  <>
                    O mestre <AvatarName player={boss} /> está escolhendo a palavra-secreta e sua categoria.
                  </>
                }
                en={
                  <>
                    The boss <AvatarName player={boss} /> is choosing the secret clue and its category.
                  </>
                }
              />
            }
          />
        </ViewOr>
      </StepSwitcher>
    </PhaseContainer>
  );
}
