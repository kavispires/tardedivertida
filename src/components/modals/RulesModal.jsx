import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';

// Design Resources
import { Typography, Image, Button, Modal, Carousel } from 'antd';
// Constants
import { PUBLIC_URL } from '../../utils/constants';

function RulesModal({ game }) {
  const [isVisible, setVisibility] = useState(false);

  const onCloseModal = () => {
    setVisibility(false);
  };

  return (
    <Fragment>
      <Button type="default" onClick={() => setVisibility(true)}>
        Regras
      </Button>
      {isVisible && (
        <Modal
          title={`Rules: ${game.title}`}
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
            {game.rules.map((rule, index) => (
              <div className="rules-modal__rule" key={rule}>
                <Image
                  src={`${PUBLIC_URL.RULES}${game.image}-${index}.jpg`}
                  fallback={`${PUBLIC_URL.RULES}game-rule-not-found.jpg`}
                  alt={rule}
                  preview={false}
                />
                <Typography.Paragraph>{rule}</Typography.Paragraph>
              </div>
            ))}
          </Carousel>
        </Modal>
      )}
    </Fragment>
  );
}

RulesModal.propTypes = {
  game: PropTypes.shape({
    image: PropTypes.string,
    rules: PropTypes.arrayOf(PropTypes.string),
    title: PropTypes.string,
  }),
};

export default RulesModal;
