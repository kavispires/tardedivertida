// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
import { useUser } from 'hooks/useUser';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
// Utils
import { PHASES } from 'utils/phases';
// Icons
import { QuestionIcon } from 'icons/QuestionIcon';
// Components
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
// Internal
import { STATUS } from './utils/constants';
import { useOnSubmitRequestAPIRequest } from './utils/api-requests';
import { StepAsk } from './StepAsk';

export function PhaseAskingForSomething({ players, state }: PhaseProps) {
  const user = useUser(players, state);
  const { step } = useStep();
  const [requester, isTheRequester] =
    state.status === STATUS.IDLE ? [user, true] : useWhichPlayerIsThe('requesterId', state, players);

  const onSubmitRequest = useOnSubmitRequestAPIRequest();

  const announcement = (
    <PhaseAnnouncement
      icon={<QuestionIcon />}
      title={
        isTheRequester ? (
          <Translate pt="Peça algo" en="Ask for something" />
        ) : (
          <Translate pt="O outro jogador pede algo" en="The other player asks for something" />
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
    <PhaseContainer phase={state?.phase} allowedPhase={PHASES.COMUNICACAO_DUO.ASKING_FOR_SOMETHING}>
      <StepSwitcher step={step} players={players}>
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
