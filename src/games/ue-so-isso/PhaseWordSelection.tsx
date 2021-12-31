import { useState } from 'react';
// Hooks
import { useIsUserReady, useWhichPlayerIsThe, useAPICall, useLanguage } from '../../hooks';
// Resources & Utils
import { UE_SO_ISSO_API } from '../../adapters';
import { PHASES } from '../../utils/phases';
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
  translate,
  ViewIf,
} from '../../components';
import StepWordSelection from './StepWordSelection';
import { GameProgressBar } from './GameProgressBar';
import { GuesserWaitingRoom } from './GuesserWaitingRoom';

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
  const language = useLanguage();
  const [guesser, isUserTheGuesser] = useWhichPlayerIsThe('guesserId', state, players);
  const [step, setStep] = useState(0);

  const onSendSelectedWordsAPIRequest = useAPICall({
    apiFunction: UE_SO_ISSO_API.submitAction,
    actionName: 'submit-votes',
    onBeforeCall: () => setStep(3),
    onError: () => setStep(1),
    successMessage: translate('Votos enviados com sucesso!', 'Votes send successfully!', language),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar seus votos',
      'Oops, the application failed to send your votes',
      language
    ),
  });

  const onSendSelectedWords = (payload: PlainObject) => {
    onSendSelectedWordsAPIRequest({
      action: 'SUBMIT_VOTES',
      ...payload,
    });
  };

  return (
    <PhaseContainer
      info={info}
      phase={state?.phase}
      allowedPhase={PHASES.UE_SO_ISSO.WORD_SELECTION}
      className="u-word-selection-phase"
    >
      <StepSwitcher
        step={step}
        conditions={[!isUserReady]}
        players={players}
        waitingRoomInstruction={translate(
          'Aguarde os outros jogadores',
          'Wait for the other players',
          language
        )}
      >
        {/* Step 0 */}
        <RoundAnnouncement round={state.round} onPressButton={() => setStep(1)} time={7}>
          <RoundAnnouncementText guesser={guesser} groupScore={state.groupScore} round={state.round} />
        </RoundAnnouncement>

        {/* Step 1 */}
        <PhaseAnnouncement
          type="opinions"
          title={translate('Seleção da Palavra Secreta', 'Secret Word Selection', language)}
          onClose={() => setStep(2)}
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
                    <br />A palavra mais votada será selecionada!
                  </>
                }
                en={
                  <>
                    Choose the secret word for this round.
                    <br />
                    You may select as many as you wish.
                    <br />
                    The most voted word would be selected!
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
