import React from 'react';
import {
  getHooksControls,
  getLanguageControl,
  mockGameMeta,
  mockHooks,
  mockInfo,
  mockLanguageHook,
} from '../../mocks';

import Lobby from './Lobby';

export default {
  title: 'lobby/Lobby',
  component: Lobby,
  argTypes: {
    ...getLanguageControl(),
    ...getHooksControls(),
  },
};

const Template = (args) => {
  mockLanguageHook(args);
  mockGameMeta();
  const hookedArgs = mockHooks(args);
  return <Lobby {...hookedArgs} />;
};

export const Join = Template.bind({});

Join.args = {
  info: mockInfo(),
  _withUser: false,
};

export const Waiting = Template.bind({});

Waiting.args = {
  info: mockInfo(),
  _withUser: true,
};

export const NoInfo = Template.bind({});

NoInfo.args = {
  info: {},
};
