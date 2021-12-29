import { useState } from 'react';
import { useTimer } from 'react-timer-hook';
// Design Resources
import { Button, message, Modal } from 'antd';
import { UserOutlined } from '@ant-design/icons';
// Hooks and API
import { ESPIAO_ENTRE_NOS_API } from '../../adapters';
import { useAPICall, useGlobalState } from '../../hooks';
// Components
import { ButtonContainer } from '../../components/shared';

function FinalAssessmentModal({ isModalVisible, onAdminControl, players }) {
  return (
    <Modal
      visible={isModalVisible}
      title="O Tempo Acabou!"
      footer={null}
      closable={false}
      className="e-modal"
    >
      Quem foi a última pessoa a responder uma pergunta?
      <ButtonContainer wrap>
        {Object.entries(players).map(([playerId, player]) => (
          <Button
            type="default"
            key={playerId}
            icon={<UserOutlined />}
            onClick={() => onAdminControl({ action: 'final', lastPlayer: playerId })}
          >
            {player.name}
          </Button>
        ))}
      </ButtonContainer>
    </Modal>
  );
}

function Timer({ timeRemaining, players, hideAccusationSelect }) {
  const [isAdmin] = useGlobalState('isAdmin');
  const [isModalVisible, setModalVisible] = useState(false);

  const onAdminControl = useAPICall({
    apiFunction: ESPIAO_ENTRE_NOS_API.handleAdminAction,
    actionName: 'admin-control',
    successMessage: 'Admin action com sucesso',
    errorMessage: 'Vixi, o aplicativo encontrou um erro ao tentar enviar ação',
  });

  const onTimesUp = () => {
    if (isAdmin) {
      setModalVisible(true);
    }
    hideAccusationSelect();
    message.warning('O tempo acabou!!! Preparado para a avaliação final?', 10);
  };

  const { minutes, seconds } = useTimer({
    expiryTimestamp: Date.now() + timeRemaining,
    autoStart: true,
    onExpire: onTimesUp,
  });

  return (
    <div className="e-timer">
      {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
      <FinalAssessmentModal
        isModalVisible={isModalVisible}
        onAdminControl={onAdminControl}
        players={players}
      />
    </div>
  );
}

export default Timer;
