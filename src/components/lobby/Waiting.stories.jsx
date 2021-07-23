import React from 'react';
import { mockAdmin, mockGameMeta, mockGlobalUser, mockInfo, mockLoading, mockPlayers } from '../../mocks';

import Waiting from './Waiting';

export default {
  title: 'lobby/_Private/Waiting',
  component: Waiting,
  argTypes: {},
};

const Template = (args) => {
  mockGlobalUser();
  mockAdmin(false);
  return <Waiting {...args} />;
};

export const Default = Template.bind({});

Default.args = {
  info: mockInfo(),
  players: {},
};

const TemplateAdmin = (args) => {
  mockLoading(false);
  mockGlobalUser();
  mockAdmin();
  mockGameMeta();
  return <Waiting {...args} />;
};

export const AdminView = TemplateAdmin.bind({});
AdminView.args = {
  info: mockInfo(),
  players: mockPlayers(3),
};
