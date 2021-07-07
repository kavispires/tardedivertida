import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';

// Design Resources
import { Button, Modal } from 'antd';
import { ReadOutlined } from '@ant-design/icons';
// Components
import RulesCarousel from '../rules/RulesCarousel';

export function RulesModal({ gameInfo }) {
  const [isVisible, setVisibility] = useState(false);

  const onCloseModal = () => {
    setVisibility(false);
  };

  return (
    <Fragment>
      <Button type="default" onClick={() => setVisibility(true)} icon={<ReadOutlined />}>
        Regras
      </Button>
      {isVisible && (
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
          <RulesCarousel info={gameInfo} />
        </Modal>
      )}
    </Fragment>
  );
}

RulesModal.propTypes = {
  gameInfo: PropTypes.shape({
    gameName: PropTypes.string,
    rules: PropTypes.arrayOf(PropTypes.string),
    title: PropTypes.string,
  }),
};
