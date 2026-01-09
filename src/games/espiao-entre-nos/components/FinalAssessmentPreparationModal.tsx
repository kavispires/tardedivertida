// Ant Design Resources
import { UserOutlined } from '@ant-design/icons';
import { Button, Modal } from 'antd';
// Types
import type { GamePlayers } from 'types/player';
// Hooks
import { useHost } from 'hooks/useHost';
// Components
import { Translate } from 'components/language';
import { SpaceContainer } from 'components/layout/SpaceContainer';

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
  const isHost = useHost();

  return (
    <Modal
      open={isHost}
      title={
        <Translate
          pt="O Tempo Acabou!"
          en="Time's up"
        />
      }
      footer={null}
      closable={false}
      className="e-modal"
    >
      <Translate
        pt="Quem foi a última pessoa a responder uma pergunta?"
        en="Who was the last person to answer a question?"
      />
      <SpaceContainer wrap>
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
      </SpaceContainer>
    </Modal>
  );
}
