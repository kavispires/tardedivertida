import React from 'react';
import {
  getLanguageControl,
  getLoadingControls,
  mockGlobalUser,
  mockInfo,
  mockLanguageHook,
  mockLoadingHook,
  mockPlayers,
} from '../../mocks';

import { Rules } from './Rules';

export default {
  title: 'rules/Rules',
  component: Rules,
  argTypes: {
    ...getLanguageControl(),
    ...getLoadingControls(),
  },
};

const Template = (args) => {
  mockGlobalUser();
  mockLanguageHook(args);
  mockLoadingHook(args);
  return <Rules {...args} />;
};

export const Default = Template.bind({});

Default.args = {
  info: mockInfo(),
  players: mockPlayers(5, true),
};
