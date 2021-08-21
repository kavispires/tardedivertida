import React, { useState } from 'react';
import PropTypes from 'prop-types';
// Hooks
import { useIsUserReady, useIsUserThe, useWhichPlayerIsThe, useAPICall, useLanguage } from '../../hooks';
// Resources & Utils
import { UE_SO_ISSO_API } from '../../adapters';
import { PHASES } from '../../utils/constants';
// Components
import {
  Instruction,
  PhaseAnnouncement,
  PhaseContainer,
  RoundAnnouncement,
  Step,
  StepSwitcher,
  Translate,
  translate,
  ViewIf,
  DefaultWaitingRoom,
} from '../../components/shared';
import WordSelectionStep from './WordSelectionStep';
import { AvatarName } from '../../components/avatars';
import { GameProgressBar } from './GameProgressBar';
import { GuesserWaitingRoom } from './GuesserWaitingRoom';

function RoundAnnouncementText({ guesser, gameOrder, groupScore, round }) {
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
      <GameProgressBar groupScore={groupScore} currentRound={round.current} totalRounds={round.total} />
    </Instruction>
  );
}

function PhaseWordSelection({ state, players, info }) {
  const isUserReady = useIsUserReady(players, state);
  const language = useLanguage();
  const guesser = useWhichPlayerIsThe('guesser', state, players);
  const isUserTheGuesser = useIsUserThe('guesser', state);
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

  const onSendSelectedWords = (payload) => {
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
      <StepSwitcher step={step} conditions={[!isUserReady]}>
        {/* Step 0 */}
        <RoundAnnouncement round={state.round} onPressButton={() => setStep(1)} time={7}>
          <RoundAnnouncementText
            guesser={guesser}
            groupScore={state.groupScore}
            gameOrder={state.gameOrder}
            round={state.round}
          />
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
            <WordSelectionStep
              words={state?.words}
              onSendSelectedWords={onSendSelectedWords}
              guesser={guesser}
            />
          </ViewIf>
        </Step>

        {/* Step 3 */}
        <Step fullWidth>
          <DefaultWaitingRoom players={players} />
        </Step>
      </StepSwitcher>
    </PhaseContainer>
  );
}

PhaseWordSelection.propTypes = {
  info: PropTypes.object,
  players: PropTypes.object,
  state: PropTypes.shape({
    gameOrder: PropTypes.any,
    groupScore: PropTypes.number,
    nextGuesser: PropTypes.string,
    phase: PropTypes.string,
    round: PropTypes.shape({
      current: PropTypes.number,
      total: PropTypes.number,
    }),
    words: PropTypes.any,
  }),
};

export default PhaseWordSelection;
