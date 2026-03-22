import { Fragment } from 'react/jsx-runtime';
// Types
import type { PhaseProps, GamePlayer } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
// Icons
import { OpinionsIcon } from 'icons/OpinionsIcon';
// Components
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { PlayerAvatarName } from 'components/player';
import { RoundAnnouncement } from 'components/round';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
import { ViewIf } from 'components/views';
// Internal
import { useOnSubmitVotesAPIRequest } from './utils/api-requests';
import { UE_SO_ISSO_PHASES } from './utils/constants';
import type { PhaseWordSelectionState } from './utils/types';
import { GroupProgress } from './components/GroupProgress';
import { GuesserWaitingRoom } from './components/GuesserWaitingRoom';
import { StepWordSelection } from './StepWordSelection';

type RoundAnnouncementTextProps = {
  guesser: GamePlayer;
  group: GroupProgress;
};

function RoundAnnouncementText({ guesser, group }: RoundAnnouncementTextProps) {
  return (
    <Instruction contained>
      <Translate
        pt={
          <>
            Para essa rodada,{' '}
            <PlayerAvatarName
              player={guesser}
              addressUser
            />{' '}
            será o(a) adivinhador(a).
          </>
        }
        en={
          <>
            For this round,{' '}
            <PlayerAvatarName
              player={guesser}
              addressUser
            />{' '}
            will be the guesser.
          </>
        }
      />
      <br />
      <GroupProgress group={group} />
    </Instruction>
  );
}

export function PhaseWordSelection({ state, players }: PhaseProps<PhaseWordSelectionState>) {
  const [guesser, isUserTheGuesser] = useWhichPlayerIsThe('guesserId', state, players);
  const { step, setStep, goToNextStep } = useStep(0);

  const onSendSelectedWords = useOnSubmitVotesAPIRequest(setStep);

  const announcement = (
    <PhaseAnnouncement
      icon={<OpinionsIcon />}
      title={
        <Translate
          pt="Seleção da Palavra Secreta"
          en="Secret Word Selection"
        />
      }
      currentRound={state?.round?.current}
      type="overlay"
    >
      {isUserTheGuesser ? (
        <Instruction>
          <Translate
            pt={
              <>
                Os outros jogadores escolherão a palavra secreta.
                <br />
                Aguarde...
              </>
            }
            en={
              <>
                The other players will now choose the secret word.
                <br />
                Just wait...
              </>
            }
          />
        </Instruction>
      ) : (
        <Instruction>
          <Translate
            pt={
              <>
                Selecione a palavra secreta para essa rodada.
                <br />
                Você pode selecionar quantas quiser.
                <br />A palavra mais votada será usada nessa rodada!
              </>
            }
            en={
              <>
                Choose the secret word for this round.
                <br />
                You may select as many as you wish.
                <br />
                The most voted word would be used this round!
              </>
            }
          />
        </Instruction>
      )}
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer
      phase={state?.phase}
      allowedPhase={UE_SO_ISSO_PHASES.WORD_SELECTION}
    >
      <StepSwitcher
        step={step}
        players={players}
      >
        {/* Step 0 */}
        <RoundAnnouncement
          round={state.round}
          onPressButton={goToNextStep}
          time={7}
        >
          <RoundAnnouncementText
            guesser={guesser}
            group={state.group}
          />
        </RoundAnnouncement>

        {/* Step 1 */}
        <Fragment>
          <ViewIf condition={isUserTheGuesser}>
            <GuesserWaitingRoom
              players={players}
              instructionSuffix={{
                pt: 'decidem a palavra secreta',
                en: 'choose a secret word',
              }}
              announcement={announcement}
              phase={state.phase}
              guesser={guesser}
              turnOrder={state.gameOrder}
            />
          </ViewIf>
          <ViewIf condition={!isUserTheGuesser}>
            <StepWordSelection
              words={state?.words}
              onSendSelectedWords={onSendSelectedWords}
              guesser={guesser}
              announcement={announcement}
              turnOrder={state.gameOrder}
              players={players}
            />
          </ViewIf>
        </Fragment>
      </StepSwitcher>
    </PhaseContainer>
  );
}
