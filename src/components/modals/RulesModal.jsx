import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';

// Design Resources
import { Button, Modal } from 'antd';
import { ReadOutlined } from '@ant-design/icons';
// Components
import { RulesCarousel } from '../rules/index';
import { useLanguage } from '../../hooks';
import { Translate, translate } from '../shared';

export function RulesModal({ gameInfo }) {
  const language = useLanguage();
  const [isVisible, setVisibility] = useState(false);

  const onCloseModal = () => {
    setVisibility(false);
  };

  return (
    <Fragment>
      <Button type="default" onClick={() => setVisibility(true)} icon={<ReadOutlined />}>
        <Translate pt="Regras" en="Rules" />
      </Button>
      {isVisible && (
        <Modal
          title={`${translate('Regras', 'Rules', language)}: ${gameInfo.title[language]}`}
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
    </Fragment>
  );
}

RulesModal.propTypes = {
  gameInfo: PropTypes.shape({
    gameName: PropTypes.string,
    rules: PropTypes.shape({
      pt: PropTypes.arrayOf(PropTypes.string),
      en: PropTypes.arrayOf(PropTypes.string),
    }),
    title: PropTypes.shape({
      pt: PropTypes.string,
      en: PropTypes.string,
    }),
  }),
};
