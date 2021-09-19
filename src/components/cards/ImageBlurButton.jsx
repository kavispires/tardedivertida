import PropTypes from 'prop-types';
import { EyeInvisibleOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import React from 'react';
import { useBlurCards } from '../../hooks';
import { Translate } from '../shared';
import clsx from 'clsx';

export function ImageBlurButton({ cardId }) {
  const [, addBlurCard, blurEnabled] = useBlurCards();

  return blurEnabled ? (
    <Tooltip
      placement="top"
      title={
        <Translate
          pt="Aperte o botão para embaçar a foto caso você tenha alguma fobia"
          en="Use this button to blur the image in case of any phobia"
        />
      }
    >
      <Button ghost onClick={() => addBlurCard(cardId)} size="small" className="image-blur-button">
        <EyeInvisibleOutlined /> <Translate pt="Credo" en="Blur" />
      </Button>
    </Tooltip>
  ) : (
    <></>
  );
}

ImageBlurButton.propTypes = {
  cardId: PropTypes.string,
};

export function ImageBlurButtonContainer({ cardId, className, children, ...props }) {
  return (
    <div className={clsx('image-blur-button-container', className)} {...props}>
      {children}
      <ImageBlurButton cardId={cardId} />
    </div>
  );
}
ImageBlurButtonContainer.propTypes = {
  children: PropTypes.any,
};
