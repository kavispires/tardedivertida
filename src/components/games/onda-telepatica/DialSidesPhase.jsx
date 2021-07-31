import React, { useState } from 'react';
import PropTypes from 'prop-types';
// Hooks
import {
  useIsUserReady,
  useWhichPlayerIsThe,
  useIsUserThe,
  useAPICall,
  useIsUsersTeamActive,
} from '../../../hooks';
// Resources & Utils
import { ONDA_TELEPATICA_API } from '../../../adapters';
import { PHASES } from '../../../utils/constants';
// Components
import {
  Instruction,
  PhaseContainer,
  RoundAnnouncement,
  Step,
  StepSwitcher,
  ViewIf,
  WaitingRoom,
} from '../../shared';
import CardSelection from './CardSelection';
import { AvatarName } from '../../avatars';

function DialSidesPhase({ state, players, info }) {
  const isUserReady = useIsUserReady(players, state);
  const [step, setStep] = useState(0);
  const psychic = useWhichPlayerIsThe('psychic', state, players);
  const isUserThePsychic = useIsUserThe('psychic', state);
  const isUsersTeamActive = useIsUsersTeamActive(state, players);

  const onSendChosenSide = useAPICall({
    apiFunction: ONDA_TELEPATICA_API.submitSides,
    actionName: 'submit-side',
    onBeforeCall: () => setStep(2),
    onError: () => setStep(1),
    successMessage: 'Carta selecionada com sucesso',
    errorMessage: 'Vixi, ocorreu um erro ao tentar enviar a carta',
  });

  return (
    <PhaseContainer
      info={info}
      phase={state?.phase}
      allowedPhase={PHASES.ONDA_TELEPATICA.DIAL_SIDES}
      className="o-dial-sides-phase"
    >
      <StepSwitcher step={step} conditions={[!isUserReady]}>
        {/* Step 0 */}
        <RoundAnnouncement
          round={state.round}
          onPressButton={() => setStep(1)}
          players={players}
          teams={state.teams}
          time={10}
        >
          <ViewIf isVisible={isUsersTeamActive}>
            <Instruction contained>
              É a vez do seu time!
              <br />
              <AvatarName player={psychic} uppercase size="large" addressUser />
              será o(a) medium
            </Instruction>
          </ViewIf>

          <ViewIf isVisible={!isUsersTeamActive}>
            <Instruction contained>
              É a vez do
              <span className="u-word-selection-phase__guesser-name-announcement">
                TIME {state.activeTeam}
              </span>
              <br />
              <AvatarName player={psychic} uppercase size="large" addressUser />
              será o(a) medium
            </Instruction>
          </ViewIf>

          <div className="u-word-selection-phase__team-points"></div>
        </RoundAnnouncement>

        {/* Step 1 */}
        <Step fullWidth>
          <ViewIf isVisible={isUserThePsychic}>
            <CardSelection onSendChosenSide={onSendChosenSide} cards={state.cards} />
          </ViewIf>

          <ViewIf isVisible={!isUserThePsychic}>
            <WaitingRoom
              players={players}
              title={`${psychic.name} está escolhendo uma carta...`}
              instruction="Aguarde enquanto ele(a) decide a carta que será usada nessa rodada."
            />
          </ViewIf>
        </Step>

        {/* Step 2 */}
        <WaitingRoom
          players={players}
          title="Pronto!"
          instruction="Vamos aguardar o jogo iniciar a próxima fase."
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}

DialSidesPhase.propTypes = {
  info: PropTypes.object,
  players: PropTypes.object,
  state: PropTypes.object,
};

export default DialSidesPhase;
