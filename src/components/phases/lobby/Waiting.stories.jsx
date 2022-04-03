import {
  getLanguageControl,
  mockAdmin,
  mockGameMeta,
  mockGlobalUser,
  mockInfo,
  mockLanguageHook,
  mockLoading,
  mockPlayers,
} from 'mocks';

import Waiting from './Waiting';

export default {
  title: 'lobby/_private/Waiting',
  component: Waiting,
  argTypes: {
    ...getLanguageControl(),
  },
};

const Template = (args) => {
  mockLanguageHook(args);
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
  mockLanguageHook(args);
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
