import { Fragment } from 'react/jsx-runtime';
// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
// Icons
import { GuessLanguageIcon } from 'icons/GuessLanguageIcon';
// Components
import { Translate } from 'components/language/Translate';
import { PhaseAnnouncement } from 'components/phases/PhaseAnnouncement';
import { PhaseContainer } from 'components/phases/PhaseContainer';
import { StepSwitcher } from 'components/steps/StepSwitcher';
import { Instruction } from 'components/text/Instruction';
import { ViewIf } from 'components/views/ViewIf';
// Internal
import type { PhaseGuessingState } from './utils/types';
import { useOnSubmitGuessAPIRequest } from './utils/api-requests';
import { METALINGUAGEM_PHASES } from './utils/constants';
import { Portmanteau } from './components/Portmanteau';
import { StepGuessItems } from './StepGuessItems';
import { StepWaitGuessing } from './StepWaitGuessing';

export function PhaseGuessing({ state, players, user }: PhaseProps<PhaseGuessingState>) {
  const { step, setStep } = useStep();
  const [creator, isTheCreator] = useWhichPlayerIsThe('creatorId', state, players);

  const onSubmitGuesses = useOnSubmitGuessAPIRequest(setStep);

  const announcement = (
    <PhaseAnnouncement
      icon={<GuessLanguageIcon />}
      title={
        <Translate
          pt="Adivinhe os items"
          en="Guess the items"
        />
      }
      currentRound={state?.round?.current}
      type="overlay"
    >
      <Instruction>
        <Translate
          pt="Agoras os jogadores tem que adivinhar quais dois itens formam a palavra-valise"
          en="Now the players have to guess which two items form the portmanteau"
        />
      </Instruction>
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer
      phase={state?.phase}
      allowedPhase={METALINGUAGEM_PHASES.GUESSING}
    >
      <StepSwitcher
        step={step}
        players={players}
        waitingRoom={{
          content: (
            <Portmanteau
              itemsIds={user?.guesses ?? []}
              word={state.newWord}
            />
          ),
        }}
      >
        {/* Step 0 */}
        <Fragment>
          <ViewIf condition={isTheCreator}>
            <StepWaitGuessing
              players={players}
              creator={creator}
              announcement={announcement}
              items={state.items}
              wordLengths={state.wordLengths}
              newWord={state.newWord}
              turnOrder={state.turnOrder}
              beginsWith={state.beginsWith}
              endsWith={state.endsWith}
            />
          </ViewIf>
          <ViewIf condition={!isTheCreator}>
            <StepGuessItems
              announcement={announcement}
              items={state.items}
              wordLengths={state.wordLengths}
              newWord={state.newWord}
              onSubmitGuesses={onSubmitGuesses}
              players={players}
              user={user}
              beginsWith={state.beginsWith}
              endsWith={state.endsWith}
            />
          </ViewIf>
        </Fragment>
      </StepSwitcher>
    </PhaseContainer>
  );
}
