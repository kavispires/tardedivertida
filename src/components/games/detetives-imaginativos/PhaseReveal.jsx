import React, { useState } from 'react';
import PropTypes from 'prop-types';
// Hooks
import { useWhichPlayerIsThe, useLanguage } from '../../../hooks';
// Resources & Utils
import { PHASES } from '../../../utils/constants';
// Components
import {
  Instruction,
  PhaseAnnouncement,
  PhaseContainer,
  RankingBoard,
  RoundsLeftInstruction,
  Step,
  StepSwitcher,
  Title,
  Translate,
  translate,
} from '../../shared';
import { AvatarName } from '../../avatars';
import { AdminForceNextPhase } from '../../admin/index';
import VotingOptions from './VotingOptions';

function PhaseReveal({ state, players, info }) {
  const language = useLanguage();
  const impostor = useWhichPlayerIsThe('impostor', state, players);
  const [step, setStep] = useState(0);

  return (
    <PhaseContainer
      info={info}
      phase={state?.phase}
      allowedPhase={PHASES.DETETIVES_IMAGINATIVOS.REVEAL}
      className="d-voting-phase"
    >
      <StepSwitcher step={step}>
        {/* Step 0 */}
        <PhaseAnnouncement
          type="rank"
          title={translate('Revelação', 'Reveal', language)}
          onClose={() => setStep(1)}
          currentRound={state?.round?.current}
        >
          <Instruction>
            <Translate
              pt={
                <>
                  Se o impostor recebeu 2 ou mais votos ele(a) é desmascarado. Quem votou nele ganha 3 pontos.
                  <br />
                  Se o impostor recebeu menos de 2 votos, ele ganha 5 pontos e o detetive líder ganha 4
                  pontos.
                </>
              }
              en={
                <>
                  If the impostor gets 2 or more votes, they are exposed. Whoever voted for him get 3 points.
                  <br />
                  If the impostor gets fewer than 2 votes, he gets 5 pointns and the Lead detective gets 4
                  points.
                </>
              }
            />
          </Instruction>
        </PhaseAnnouncement>

        {/* Step 1 */}
        <Step key={1}>
          <Title>
            <Translate pt="O impostor era " en="The impostor was " />
            {<AvatarName player={impostor} />}
          </Title>
          <Instruction contained>
            {state.impostorVotes > 1 ? (
              <Translate
                pt="Ele(a) recebeu mais de dois votos! Quem votou nele(a) ganha 3 pontos!"
                en="They received more than 2 votes! Who voted for them gets 3 points!"
              />
            ) : (
              <Translate
                pt={
                  <>
                    Ele(a) não recebeu mais de 2 votos: <b>Impostor</b> ganha 5 pontos e <b>Líder</b> ganha 4
                    pontos!
                  </>
                }
                en={
                  <>
                    They did not get enough votes: the <b>Impostor</b> gets 5 points and the{' '}
                    <b>Lead Detective</b> gets 4 points!
                  </>
                }
              />
            )}
          </Instruction>
          <VotingOptions players={players} isAllDisabled={true} leader={state.leader} />
          <RankingBoard players={players} ranking={state.ranking} />

          <RoundsLeftInstruction round={state?.round} />

          <AdminForceNextPhase
            buttonText={translate(
              'Ir para próxima rodada ou game over',
              'Go to next round or Game Over',
              language
            )}
          />
        </Step>
      </StepSwitcher>
    </PhaseContainer>
  );
}

PhaseReveal.propTypes = {
  info: PropTypes.any,
  players: PropTypes.any,
  state: PropTypes.shape({
    impostorVotes: PropTypes.number,
    phase: PropTypes.any,
    ranking: PropTypes.any,
    roundsToEndGame: PropTypes.number,
  }),
};

export default PhaseReveal;
