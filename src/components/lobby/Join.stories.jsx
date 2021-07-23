import React from 'react';
import { mockInfo, mockPlayers } from '../../mocks';

import Join from './Join';

export default {
  title: 'lobby/_Private/Join',
  component: Join,
  argTypes: {},
};

const Template = (args) => <Join {...args} />;

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
