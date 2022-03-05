import { getLanguageControl, mockLanguageHook, mockPlayers, mockTeams } from 'mocks';

import { SectionTeams } from './SectionTeams';

export default {
  title: 'Drawers/_private/SectionTeams',
  component: SectionTeams,
  argTypes: {
    ...getLanguageControl(),
  },
};

const Template = (args) => {
  mockLanguageHook(args);
  return <SectionTeams {...args} />;
};

export const Default = Template.bind({});

Default.args = {
  players: mockPlayers(6),
  teams: mockTeams(2, 3),
};
