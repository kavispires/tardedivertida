import React from 'react';
import { Typography, Image, Button, Modal, Carousel } from 'antd';
import { PUBLIC_URL } from '../../utils/constants';

function RulesModal({ gameInfo, isVisible, onCloseModal }) {
  console.log(gameInfo.rules);
  return (
    <Modal
      title={`Rules: ${gameInfo.title}`}
      visible={isVisible}
      onCancel={onCloseModal}
      className="rules-modal"
      footer={[
        <Button key="close" onClick={onCloseModal}>
          Fechar
        </Button>,
      ]}
    >
      <Carousel className="rules-modal__rules">
        {gameInfo.rules.map((rule, index) => (
          <div className="rules-modal__rule" key={rule}>
            <Image
              src={`${PUBLIC_URL.RULES}${gameInfo.image}-${index}.jpg`}
              fallback={`${PUBLIC_URL.RULES}game-rule-not-found.jpg`}
              alt={rule}
              preview={false}
            />
            <Typography.Paragraph>{rule}</Typography.Paragraph>
          </div>
        ))}
      </Carousel>
    </Modal>
  );
}

export default RulesModal;
