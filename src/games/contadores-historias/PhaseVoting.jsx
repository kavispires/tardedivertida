import { useState } from 'react';
import PropTypes from 'prop-types';
// Hooks
import { useWhichPlayerIsThe, useAPICall, useUser, useLanguage } from '../../hooks';
// Resources & Utils
import { CONTADORES_HISTORIAS_API } from '../../adapters';
import { PHASES } from '../../utils/constants';
// Components
import {
  Instruction,
  PhaseAnnouncement,
  PhaseContainer,
  Step,
  StepSwitcher,
  Translate,
  translate,
} from '../../components/shared';
import StepVoting from './StepVoting';
import { ImageCardPreloadHand } from '../../components/cards';

function PhaseVoting({ state, players, info }) {
  const language = useLanguage();
  const user = useUser(players);
  const [storyteller, isUserTheStoryTeller] = useWhichPlayerIsThe('storytellerId', state, players);
  const [step, setStep] = useState(0);

  const onSubmitVote = useAPICall({
    apiFunction: CONTADORES_HISTORIAS_API.submitAction,
    actionName: 'submit-vote',
    onError: () => setStep(1),
    successMessage: translate('Voto submetido com sucesso', 'Vote submitted successfully', language),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar seu voto',
      'Oops, the application found an error while trying to submit your card',
      language
    ),
  });

  return (
    <PhaseContainer
      info={info}
      phase={state?.phase}
      allowedPhase={PHASES.CONTADORES_HISTORIAS.VOTING}
      className="c-phase"
    >
      <StepSwitcher step={step}>
        {/* Step 0 */}
        <PhaseAnnouncement
          type="vote"
          title={translate('Votação', 'Voting', language)}
          onClose={() => setStep(1)}
          currentRound={state?.round?.current}
        >
          <Instruction>
            <Translate
              pt={
                <>
                  Hora de selecionar a carta correta!
                  <br />
                  Se todos acertarem ou todos errarem, cada jogador ganha 2 pontos, menos o contador de
                  histórias.
                  <br />
                  Se somente alguns acertarem, cada acertador e contador de histórias recebe 3 pontos.
                  <br />
                  Sua carta (se você não for o contador de histórias) ganha 1 ponto se alguém selecionar.
                </>
              }
              en={
                <>
                  Time to select the correct card!
                  <br />
                  If every player gets it correct or wrong, each player but the storyteller gets 2 points.
                  <br />
                  If only some get it correct, those players (and the storyteller) get 3 points.
                  <br />
                  You get 1 point for every vote your card gets (if you are not the storyteller).
                </>
              }
            />
          </Instruction>
          <ImageCardPreloadHand hand={state.table.map((entry) => entry.cardId)} />
        </PhaseAnnouncement>

        {/* Step 1 */}
        <Step fullWidth>
          <StepVoting
            players={players}
            user={user}
            story={state.story}
            onSubmitVote={onSubmitVote}
            storyteller={storyteller}
            isUserTheStoryTeller={isUserTheStoryTeller}
            table={state.table}
          />
        </Step>
      </StepSwitcher>
    </PhaseContainer>
  );
}

PhaseVoting.propTypes = {
  info: PropTypes.object,
  players: PropTypes.object,
  state: PropTypes.shape({
    phase: PropTypes.string,
    round: PropTypes.shape({
      current: PropTypes.number,
      total: PropTypes.number,
    }),
    story: PropTypes.string,
    table: PropTypes.arrayOf(
      PropTypes.shape({
        playerId: PropTypes.string,
        cardId: PropTypes.string,
        votes: PropTypes.arrayOf(PropTypes.string),
      })
    ),
  }),
};

export default PhaseVoting;
