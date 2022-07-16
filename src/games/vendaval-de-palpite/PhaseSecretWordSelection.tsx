// Hooks
import { useLanguage, useStep, useWhichPlayerIsThe } from 'hooks';
import { useOnSubmitSecretWordAPIRequest } from './utils/api-requests';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Components
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
import { Translate } from 'components/language';
import { AvatarName } from 'components/avatars';
import { ViewOr } from 'components/views';
import { StepSecretWordSelection } from './StepSecretWordSelection';
import { StepWaiting } from './StepWaiting';
import { KnowledgeIcon } from 'components/icons/KnowledgeIcon';

function PhaseSecretWordSelection({ state, players, info }: PhaseProps) {
  const { translate } = useLanguage();
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
          title={translate('A Palavra Secreta', 'The Secret Word')}
          onClose={goToNextStep}
          currentRound={state?.round?.current}
          duration={5}
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
        <ViewOr orCondition={isUserTheBoss}>
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

export default PhaseSecretWordSelection;
