// Ant Design Resources
import { Button, Modal } from 'antd';
import { UserOutlined } from '@ant-design/icons';
// Hooks and API
import { useGlobalState, useLanguage } from 'hooks';
// Components
import { ButtonContainer, Translate } from 'components';

type FinalAssessmentModalProps = {
  // isModalVisible: boolean;
  onSendLastQuestioner: GenericFunction;
  players: GamePlayers;
};

export function FinalAssessmentPreparationModal({
  // isModalVisible,
  onSendLastQuestioner,
  players,
}: FinalAssessmentModalProps) {
  const [isAdmin] = useGlobalState('isAdmin');
  const { translate } = useLanguage();

  return (
    <Modal
      visible={isAdmin}
      title={translate('O Tempo Acabou!', "Time's up")}
      footer={null}
      closable={false}
      className="e-modal"
    >
      <Translate
        pt="Quem foi a última pessoa a responder uma pergunta?"
        en="Who was the last person to answer a question?"
      />
      <ButtonContainer wrap>
        {Object.entries(players).map(([playerId, player]) => (
          <Button
            type="default"
            key={playerId}
            icon={<UserOutlined />}
            onClick={() => onSendLastQuestioner({ lastPlayerId: playerId })}
          >
            {player.name}
          </Button>
        ))}
      </ButtonContainer>
    </Modal>
  );
}
