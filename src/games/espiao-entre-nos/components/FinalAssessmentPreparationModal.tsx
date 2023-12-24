// Ant Design Resources
import { Button, Modal, Space } from 'antd';
import { UserOutlined } from '@ant-design/icons';
// Hooks and API
import { useHost } from 'hooks/useHost';
// Components
import { Translate } from 'components/language';

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
  const isVIP = useHost();

  return (
    <Modal
      open={isVIP}
      title={<Translate pt="O Tempo Acabou!" en="Time's up" />}
      footer={null}
      closable={false}
      className="e-modal"
    >
      <Translate
        pt="Quem foi a última pessoa a responder uma pergunta?"
        en="Who was the last person to answer a question?"
      />
      <Space className="space-container" align="center" wrap>
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
      </Space>
    </Modal>
  );
}
