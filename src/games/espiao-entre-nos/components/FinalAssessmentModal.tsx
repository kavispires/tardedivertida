// Ant Design Resources
import { Modal, Space } from 'antd';
// Components
import { Translate } from 'components/language';
import { PlayerSelect } from './PlayerSelect';
import { FinalAssessmentInstruction } from './RulesBlobs';

type FinalAssessmentModalProps = {
  isModalVisible: boolean;
  onMakeAccusation: GenericFunction;
  players: GamePlayers;
  finalAssessment: FinalAssessment;
};

export function FinalAssessmentModal({
  isModalVisible,
  onMakeAccusation,
  players,
  finalAssessment,
}: FinalAssessmentModalProps) {
  return (
    <Modal
      open={isModalVisible}
      title={<Translate pt="Quem você vai acusar?" en="Who are you gonna accuse?" />}
      footer={null}
      closable={false}
      className="e-modal"
    >
      <FinalAssessmentInstruction finalAssessment={finalAssessment} players={players} />
      <Translate
        pt="Não há tempo pra pensar, escolha alguém!"
        en="There's no time to think, just choose someone"
      />

      <Space className="space-container" align="center">
        <PlayerSelect players={players} onSend={onMakeAccusation} isFinalAssessment />
      </Space>
    </Modal>
  );
}
