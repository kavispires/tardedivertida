import React from 'react';
import { message } from 'antd';

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
          <small>Click para fechar</small>
        </p>
      </div>
    ),
    top: window.innerWidth / 2 - 100,
    duration,
    key,
    onClick: () => message.destroy(key),
  };
};
