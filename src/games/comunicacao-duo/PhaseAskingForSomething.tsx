// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
// Icons
import { QuestionIcon } from 'icons/QuestionIcon';
// Components
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
// Internal
import { COMUNICACAO_DUO_PHASES, STATUS } from './utils/constants';
import { useOnSubmitRequestAPIRequest } from './utils/api-requests';
import { StepAsk } from './StepAsk';

export function PhaseAskingForSomething({ players, state, user }: PhaseProps) {
  const { step } = useStep();
  let [requester, isTheRequester] = useWhichPlayerIsThe('requesterId', state, players);
  if (state.status === STATUS.IDLE) {
    requester = user;
    isTheRequester = true;
  }

  const onSubmitRequest = useOnSubmitRequestAPIRequest();

  const announcement = (
    <PhaseAnnouncement
      icon={<QuestionIcon />}
      title={
        isTheRequester ? (
          <Translate
            pt="Peça algo"
            en="Ask for something"
          />
        ) : (
          <Translate
            pt="O outro jogador pede algo"
            en="The other player asks for something"
          />
        )
      }
      currentRound={state?.round?.current}
      type="overlay"
    >
      <Instruction>
        <Translate
          pt={<>Cada alienígena deve dar dicar para todos os itens marcados com sua cor</>}
          en={<>Each alien must give clues for all items marked with their color</>}
        />
      </Instruction>
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer
      phase={state?.phase}
      allowedPhase={COMUNICACAO_DUO_PHASES.ASKING_FOR_SOMETHING}
    >
      <StepSwitcher
        step={step}
        players={players}
      >
        {/* Step 0 */}
        <StepAsk
          user={user}
          players={players}
          announcement={announcement}
          deckType={state.deckType}
          deck={state.deck}
          status={state.status}
          history={state.history}
          requester={requester}
          isTheRequester={isTheRequester}
          summary={state.summary}
          clueInputType={state.clueInputType}
          onSubmitRequest={onSubmitRequest}
          round={state.round}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
