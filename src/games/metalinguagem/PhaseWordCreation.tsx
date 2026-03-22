import { Fragment } from 'react/jsx-runtime';
// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
// Icons
import { CreateIcon } from 'icons/CreateIcon';
// Components
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { PlayerAvatarName } from 'components/player';
import { TurnOrder } from 'components/players';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
import { ViewIf } from 'components/views';
// Internal
import type { PhaseWordCreationState } from './utils/types';
import { useOnSubmitNewWordAPIRequest } from './utils/api-requests';
import { METALINGUAGEM_PHASES } from './utils/constants';
import { StepCreateWord } from './StepCreateWord';
import { StepWaitWordCreation } from './StepWaitWordCreation';

export function PhaseWordCreation({ state, players, user }: PhaseProps<PhaseWordCreationState>) {
  const { step } = useStep();
  const [creator, isTheCreator] = useWhichPlayerIsThe('creatorId', state, players);

  const onSubmitWord = useOnSubmitNewWordAPIRequest();

  const announcement = (
    <PhaseAnnouncement
      icon={<CreateIcon />}
      title={
        <Translate
          pt="A Palavra-Valise"
          en="The Portmanteau"
        />
      }
      currentRound={state?.round?.current}
      type="overlay"
    >
      <Instruction>
        <Translate
          pt={
            <>
              Hora de{' '}
              <PlayerAvatarName
                player={creator}
                addressUser
              />{' '}
              criar a nova palavra!
            </>
          }
          en={
            <>
              Time for{' '}
              <PlayerAvatarName
                player={creator}
                addressUser
              />{' '}
              to create the new word!
            </>
          }
        />
      </Instruction>

      <TurnOrder
        players={players}
        order={state.turnOrder}
        activePlayerId={state.creatorId}
      />
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer
      phase={state?.phase}
      allowedPhase={METALINGUAGEM_PHASES.WORD_CREATION}
    >
      <StepSwitcher
        step={step}
        players={players}
      >
        {/* Step 0 */}
        <Fragment>
          <ViewIf condition={isTheCreator}>
            <StepCreateWord
              user={user}
              players={players}
              announcement={announcement}
              items={state.items}
              beginsWith={state.beginsWith}
              endsWith={state.endsWith}
              wordLengths={state.wordLengths}
              onSubmitWord={onSubmitWord}
            />
          </ViewIf>
          <ViewIf condition={!isTheCreator}>
            <StepWaitWordCreation
              players={players}
              announcement={announcement}
              items={state.items}
              wordLengths={state.wordLengths}
              creator={creator}
              turnOrder={state.turnOrder}
            />
          </ViewIf>
        </Fragment>
      </StepSwitcher>
    </PhaseContainer>
  );
}
