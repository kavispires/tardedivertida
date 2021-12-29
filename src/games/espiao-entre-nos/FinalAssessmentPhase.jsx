import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
// Design Resources
import { Button, Modal, notification, Select } from 'antd';
// Hooks
import { useUser, useAPICall } from '../../hooks';
// Resources & Utils
import { ESPIAO_ENTRE_NOS_API } from '../../adapters';
import { PHASES } from '../../utils/constants';
import { getPlayersFromIds } from '../../utils/helpers';
// Components
import { AdminOnly } from '../../components/admin/index';
import { ButtonContainer, Instruction, PhaseContainer, Title } from '../../components/shared';
import { EspiaoEntreNosCard as Card } from '../../components/cards';
import LocationsList from './LocationsList';
import SuspectsList from './SuspectsList';
import Notes from './Notes';
import PlayerSelect from './PlayerSelect';

function FinalAssessmentInstruction({ playerOrder, playerOrderIndex, players }) {
  return (
    <Instruction className="e-phase-instruction">
      Já que vocês falharam em encontrar o espião, há uma última possibilidade!
      <ul>
        {playerOrderIndex === 0 ? (
          <li>Cada jogador, começando por {players?.[playerOrder[0]]?.name}, faz uma acusação.</li>
        ) : (
          <li>Agora é a vez de {playerOrder[playerOrderIndex]} faz uma acusação.</li>
        )}
        <li>Se a votação for unânime em qualquer uma das votações, o jogo acaba e revelam-se os papéis.</li>
        <li>Sem discussão dessa vez, simplesmente acuse alguém! Não temos mais tempo!</li>
        <li>A ordem será essa: {getPlayersFromIds(playerOrder, players, true).join(', ')}</li>
      </ul>
    </Instruction>
  );
}

function FinalAssessmentModal({ isModalVisible, onMakeAccusation, players, playerOrder, playerOrderIndex }) {
  return (
    <Modal
      visible={isModalVisible}
      title="Quem você vai acusar?"
      footer={null}
      closable={false}
      className="e-modal"
    >
      <FinalAssessmentInstruction
        playerOrder={playerOrder}
        playerOrderIndex={playerOrderIndex}
        players={players}
      />
      Não há tempo pra pensar, escolha alguém!
      <ButtonContainer>
        <PlayerSelect players={players} onSend={onMakeAccusation} isFinalAssessment />
      </ButtonContainer>
    </Modal>
  );
}

function FinalAssessmentPhase({ state, players, info }) {
  const user = useUser(players);
  const [accuser, setAccuser] = useState(null);
  const [target, setTarget] = useState(null);

  const onAdminControl = useAPICall({
    apiFunction: ESPIAO_ENTRE_NOS_API.handleAdminAction,
    actionName: 'admin-control',
    successMessage: 'Admin action com sucesso',
    errorMessage: 'Vixi, o aplicativo encontrou um erro ao tentar enviar ação',
  });

  const onMakeAccusation = useAPICall({
    apiFunction: ESPIAO_ENTRE_NOS_API.makeAccusation,
    actionName: 'accuse',
    successMessage: 'Jogador acusado com sucesso',
    errorMessage: 'Vixi, o aplicativo encontrou um erro ao tentar acusar',
  });

  useEffect(() => {
    if (state?.outcome === 'VOTE_FAIL') {
      notification.info({
        message: 'A votação não foi unânime',
        description: state?.votedYes ? `Votaram sim: ${state?.votedYes}` : 'Ninguém votou sim',
        duration: 10,
      });
    }
  }, []); // eslint-disable-line

  const isUserTheAccuser = state.playerOrder[state.playerOrderIndex] === user.id;
  return (
    <PhaseContainer
      info={info}
      phase={state?.phase}
      allowedPhase={PHASES.ESPIAO_ENTRE_NOS.FINAL_ASSESSMENT}
      className="e-phase"
    >
      <Title level={2} className="e-phase-title">
        Última Chance!
      </Title>

      <FinalAssessmentModal
        isModalVisible={isUserTheAccuser}
        onMakeAccusation={onMakeAccusation}
        players={players}
        playerOrder={state.playerOrder}
        playerOrderIndex={state.playerOrderIndex}
      />

      <FinalAssessmentInstruction
        playerOrder={state.playerOrder}
        playerOrderIndex={state.playerOrderIndex}
        players={players}
      />

      <Card location={user.location} role={user.role} />

      <Instruction className="e-lists">
        <SuspectsList players={players} />
        <LocationsList locations={state.possibleLocations} />
      </Instruction>

      <Notes />

      <AdminOnly className="e-admin-final-assessment">
        <span>Acusador:</span>
        <Select onChange={setAccuser} className="e-select" placeholder="Acusador">
          {Object.values(players).map((player) => (
            <Select.Option key={player.id} value={player.id}>
              {player.name}
            </Select.Option>
          ))}
        </Select>
        <span>Acusado:</span>
        <Select onChange={setTarget} className="e-select" placeholder="Acusado">
          {Object.values(players).map((player) => (
            <Select.Option key={player.id} value={player.id}>
              {player.name}
            </Select.Option>
          ))}
        </Select>
        <Button
          type="primary"
          disabled={!accuser || !target || accuser === target}
          onClick={() =>
            onAdminControl({
              action: {
                accuser,
                target,
              },
            })
          }
        >
          Enviar decisão final
        </Button>
      </AdminOnly>
    </PhaseContainer>
  );
}

FinalAssessmentPhase.propTypes = {
  info: PropTypes.object,
  players: PropTypes.object,
  state: PropTypes.object,
};

export default FinalAssessmentPhase;
