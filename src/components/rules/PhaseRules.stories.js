import {
  getLanguageControl,
  getLoadingControls,
  mockGlobalUser,
  mockInfo,
  mockLanguageHook,
  mockLoadingHook,
  mockPlayers,
} from 'mocks';

import { PhaseRules } from './PhaseRules';

export default {
  title: 'PhaseRules/PhaseRules',
  component: PhaseRules,
  argTypes: {
    ...getLanguageControl(),
    ...getLoadingControls(),
  },
};

const Template = (args) => {
  mockGlobalUser();
  mockLanguageHook(args);
  mockLoadingHook(args);
  return <PhaseRules {...args} />;
};

export const Default = Template.bind({});

Default.args = {
  info: mockInfo(),
  players: mockPlayers(5, true),
};
