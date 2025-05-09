import { useState } from 'react';
// Ant Design Resources
import { ReadOutlined } from '@ant-design/icons';
import { Button, type ButtonProps, Modal } from 'antd';
// Types
import type { GameInfo } from 'types/game-info';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Components
import { Translate } from 'components/language';
import { RulesCarousel } from 'components/rules';

type RulesModalProps = {
  gameInfo: GameInfo;
  buttonProps?: ButtonProps;
};

export function RulesModal({ gameInfo, buttonProps }: RulesModalProps) {
  const { language, translate } = useLanguage();
  const [isVisible, setVisibility] = useState(false);

  const onCloseModal = () => {
    setVisibility(false);
  };

  return (
    <>
      <Button type="default" onClick={() => setVisibility(true)} icon={<ReadOutlined />} {...buttonProps}>
        <Translate pt="Regras" en="Rules" />
      </Button>
      {isVisible && (
        <Modal
          title={`${translate('Regras', 'Rules')}: ${gameInfo.title[language]}`}
          open={isVisible}
          onCancel={onCloseModal}
          className="rules-modal"
          footer={[
            <Button key="close" onClick={onCloseModal}>
              <Translate pt="Fechar" en="Close" />
            </Button>,
          ]}
        >
          <div className="rules-modal-content">
            <RulesCarousel info={gameInfo} />
          </div>
        </Modal>
      )}
    </>
  );
}
