import React from 'react';
import { message } from 'antd';

export const messageContent = (title, description, id) => {
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
    duration: 30,
    key,
    onClick: () => message.destroy(key),
  };
};
