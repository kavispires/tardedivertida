import React from 'react';
import { mockGlobalUser, mockInfo, mockLoading, mockPlayers } from '../../mocks';

import Lobby from './Lobby';

export default {
  title: 'lobby/Lobby',
  component: Lobby,
  argTypes: {
    join: { control: 'boolean', defaultValue: false },
    loading: { control: 'boolean', defaultValue: false },
    withPlayers: { control: 'boolean', defaultValue: false },
  },
};

const Template = (args) => {
  mockLoading(args.loading);
  mockGlobalUser({}, !args.join);
  return <Lobby players={args.withPlayers ? mockPlayers(4) : {}} {...args} />;
};

export const Join = Template.bind({});

Join.args = {
  info: mockInfo(),
  join: false,
};

export const Waiting = Template.bind({});

Waiting.args = {
  info: mockInfo(),
  join: true,
};

export const NoInfo = Template.bind({});

NoInfo.args = {
  info: {},
};
