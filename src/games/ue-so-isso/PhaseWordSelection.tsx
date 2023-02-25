// Hooks
import { useStep } from 'hooks/useStep';
import { useUser } from 'hooks/useUser';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Icons
import { OpinionsIcon } from 'icons/OpinionsIcon';
// Components
import { StepWordSelection } from './StepWordSelection';
import { GameProgressBar } from './components/GameProgressBar';
import { GuesserWaitingRoom } from './components/GuesserWaitingRoom';
import { useOnSubmitVotesAPIRequest } from './utils/api-requests';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { Instruction } from 'components/text';
import { Translate } from 'components/language';
import { AvatarName } from 'components/avatars';
import { StepSwitcher } from 'components/steps';
import { RoundAnnouncement } from 'components/round';
import { ViewOr } from 'components/views';

type RoundAnnouncementTextProps = {
  guesser: GamePlayer;
  groupScore: number;
  round: GameRound;
};

function RoundAnnouncementText({ guesser, groupScore, round }: RoundAnnouncementTextProps) {
  return (
    <Instruction contained>
      <Translate
        pt={
          <>
            Para essa rodada, <AvatarName player={guesser} addressUser /> será o(a) adivinhador(a).
          </>
        }
        en={
          <>
            For this round, <AvatarName player={guesser} addressUser /> will be the guesser.
          </>
        }
      />
      <br />
      <GameProgressBar groupScore={groupScore} round={round} />
    </Instruction>
  );
}

function PhaseWordSelection({ state, players, info }: PhaseProps) {
  const user = useUser(players, state);
  const [guesser, isUserTheGuesser] = useWhichPlayerIsThe('guesserId', state, players);
  const { step, goToNextStep, setStep } = useStep(0);

  const onSendSelectedWords = useOnSubmitVotesAPIRequest(setStep);

  return (
    <PhaseContainer
      info={info}
      phase={state?.phase}
      allowedPhase={PHASES.UE_SO_ISSO.WORD_SELECTION}
      className="u-word-selection-phase"
    >
      <StepSwitcher step={step} conditions={[!user.isReady]} players={players}>
        {/* Step 0 */}
        <RoundAnnouncement
          round={state.round}
          onPressButton={() => setStep(1)}
          time={7}
          circleColor={info?.appearance?.color}
        >
          <RoundAnnouncementText guesser={guesser} groupScore={state.groupScore} round={state.round} />
        </RoundAnnouncement>

        {/* Step 1 */}
        <PhaseAnnouncement
          icon={<OpinionsIcon />}
          title={<Translate pt="Seleção da Palavra Secreta" en="Secret Word Selection" />}
          onClose={goToNextStep}
          currentRound={state?.round?.current}
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

        {/* Step 2 */}

        <ViewOr condition={isUserTheGuesser}>
          <GuesserWaitingRoom
            players={players}
            instructionSuffix={{
              pt: 'decidirem a palavra secreta',
              en: 'choose a secret word',
            }}
          />

          <StepWordSelection
            words={state?.words}
            onSendSelectedWords={onSendSelectedWords}
            guesser={guesser}
          />
        </ViewOr>
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseWordSelection;
