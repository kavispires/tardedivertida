// Ant Design Resources
import { Modal } from 'antd';
// Components
import { ButtonContainer, Translate } from 'components';
import { useLanguage } from 'hooks';
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
  const { translate } = useLanguage();

  return (
    <Modal
      visible={isModalVisible}
      title={translate('Quem você vai acusar?', 'Who are you gonna accuse?')}
      footer={null}
      closable={false}
      className="e-modal"
    >
      <FinalAssessmentInstruction finalAssessment={finalAssessment} players={players} />
      <Translate
        pt="Não há tempo pra pensar, escolha alguém!"
        en="There's no time to think, just choose someone"
      />

      <ButtonContainer>
        <PlayerSelect players={players} onSend={onMakeAccusation} isFinalAssessment />
      </ButtonContainer>
    </Modal>
  );
}
