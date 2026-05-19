import { useState } from 'react';
// Ant Design Resources
import { ReadOutlined } from '@ant-design/icons';
import { Button, type ButtonProps, Modal } from 'antd';
// Types
import type { GameInfo } from 'types/game-info';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Components
import { Translate } from 'components/language/Translate';
import { RulesCarousel } from 'components/rules/RulesCarousel';
// Sass
import styles from './rules.module.scss';

type RulesModalProps = {
  /**
   * The game information object containing the rules to display
   */
  gameInfo: GameInfo;
  /**
   * Optional Ant Design button props to customize the rules button
   */
  buttonProps?: ButtonProps;
};

/**
 * Modal component that displays game rules in a carousel format with a trigger button
 */
export function RulesModal({ gameInfo, buttonProps }: RulesModalProps) {
  const { language, translate } = useLanguage();
  const [isVisible, setVisibility] = useState(false);

  const onCloseModal = () => {
    setVisibility(false);
  };

  return (
    <>
      <Button
        type="default"
        onClick={() => setVisibility(true)}
        icon={<ReadOutlined />}
        {...buttonProps}
      >
        <Translate
          pt="Regras"
          en="Rules"
        />
      </Button>
      {isVisible && (
        <Modal
          title={`${translate({ pt: 'Regras', en: 'Rules' })}: ${gameInfo.title[language]}`}
          open={isVisible}
          onCancel={onCloseModal}
          className={styles.rulesModal}
          footer={[
            <Button
              key="close"
              onClick={onCloseModal}
            >
              <Translate
                pt="Fechar"
                en="Close"
              />
            </Button>,
          ]}
        >
          <div className={styles.rulesModalContent}>
            <RulesCarousel info={gameInfo} />
          </div>
        </Modal>
      )}
    </>
  );
}
