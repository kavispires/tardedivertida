import React from 'react';
import { message } from 'antd';
import { Translate } from '../shared';
import { VideoGameController } from '../icons';

/**
 * Pops up a modal with a confirmation button but also closing timeout
 * @param {string} title
 * @param {string} description
 * @param {string} id
 * @param {number} duration
 * @returns
 */
export const messageContent = (title, description, id, duration = 30) => {
  const key = `${id} - ${title}`;

  return {
    content: (
      <div>
        <h1>{title}</h1>
        <p>{description}</p>
        <p>
          <small>
            <Translate
              pt="Popup fecha automaticamente ou clique para fechar"
              en="Auto-close or click to close"
            />
          </small>
        </p>
      </div>
    ),
    top: window.innerWidth / 2 - 100,
    duration,
    key,
    icon: <VideoGameController style={{ width: '64px' }} />,
    onClick: () => message.destroy(key),
  };
};
