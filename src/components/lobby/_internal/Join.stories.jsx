import React from 'react';
import { getLanguageControl, mockInfo, mockLanguageHook, mockPlayers } from '../../../mocks';

import Join from './Join';

export default {
  title: 'lobby/_private/Join',
  component: Join,
  argTypes: {
    ...getLanguageControl(),
  },
};

const Template = (args) => {
  mockLanguageHook(args);
  return <Join {...args} />;
};

export const Default = Template.bind({});

Default.args = {
  info: mockInfo(),
  players: {},
};

export const WithPlayers = Template.bind({});
WithPlayers.args = {
  info: mockInfo(),
  players: mockPlayers(2),
};
