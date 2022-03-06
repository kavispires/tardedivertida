// Hooks
import { useIsUserReady, useWhichPlayerIsThe, useLanguage, useStep } from 'hooks';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Components
import {
  AvatarName,
  Instruction,
  PhaseAnnouncement,
  PhaseContainer,
  RoundAnnouncement,
  Step,
  StepSwitcher,
  Translate,
  ViewIf,
} from 'components';
import { StepWordSelection } from './StepWordSelection';
import { GameProgressBar } from './GameProgressBar';
import { GuesserWaitingRoom } from './GuesserWaitingRoom';
import { useOnSubmitVotesAPIRequest } from './api-requests';

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
  const isUserReady = useIsUserReady(players, state);
  const { translate } = useLanguage();
  const [guesser, isUserTheGuesser] = useWhichPlayerIsThe('guesserId', state, players);
  const { step, nextStep, setStep } = useStep(0);

  const onSendSelectedWords = useOnSubmitVotesAPIRequest(setStep);

  return (
    <PhaseContainer
      info={info}
      phase={state?.phase}
      allowedPhase={PHASES.UE_SO_ISSO.WORD_SELECTION}
      className="u-word-selection-phase"
    >
      <StepSwitcher step={step} conditions={[!isUserReady]} players={players}>
        {/* Step 0 */}
        <RoundAnnouncement round={state.round} onPressButton={() => setStep(1)} time={7} circleColor="cream">
          <RoundAnnouncementText guesser={guesser} groupScore={state.groupScore} round={state.round} />
        </RoundAnnouncement>

        {/* Step 1 */}
        <PhaseAnnouncement
          type="opinions"
          title={translate('Seleção da Palavra Secreta', 'Secret Word Selection')}
          onClose={nextStep}
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
        <Step fullWidth>
          <ViewIf isVisible={isUserTheGuesser}>
            <GuesserWaitingRoom
              players={players}
              instructionSuffix={{
                pt: 'decidirem a palavra secreta',
                en: 'choose a secret word',
              }}
            />
          </ViewIf>

          <ViewIf isVisible={!isUserTheGuesser}>
            <StepWordSelection
              words={state?.words}
              onSendSelectedWords={onSendSelectedWords}
              guesser={guesser}
            />
          </ViewIf>
        </Step>
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseWordSelection;
