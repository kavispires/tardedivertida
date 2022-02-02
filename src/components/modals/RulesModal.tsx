import { useState } from 'react';
// Design Resources
import { Button, Modal } from 'antd';
import { ReadOutlined } from '@ant-design/icons';
// Components
import { RulesCarousel } from '../rules/index';
import { useLanguage } from '../../hooks';
import { Translate } from '../shared';

type RulesModalProps = {
  gameInfo: GameInfo;
};

export function RulesModal({ gameInfo }: RulesModalProps): JSX.Element {
  const { language, translate } = useLanguage();
  const [isVisible, setVisibility] = useState(false);

  const onCloseModal = () => {
    setVisibility(false);
  };

  return (
    <>
      <Button type="default" onClick={() => setVisibility(true)} icon={<ReadOutlined />}>
        <Translate pt="Regras" en="Rules" />
      </Button>
      {isVisible && (
        <Modal
          title={`${translate('Regras', 'Rules')}: ${gameInfo.title[language]}`}
          visible={isVisible}
          onCancel={onCloseModal}
          className="rules-modal"
          footer={[
            <Button key="close" onClick={onCloseModal}>
              <Translate pt="Fechar" en="Close" />
            </Button>,
          ]}
        >
          <RulesCarousel info={gameInfo} />
        </Modal>
      )}
    </>
  );
}
