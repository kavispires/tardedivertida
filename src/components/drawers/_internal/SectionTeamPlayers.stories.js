import React from 'react';
import { getLanguageControl, mockLanguageHook, mockPlayers, mockTeams } from '../../../mocks';

import { SectionTeamPlayers } from './SectionTeamPlayers';

export default {
  title: 'drawers/_private/SectionTeamPlayers',
  component: SectionTeamPlayers,
  argTypes: {
    ...getLanguageControl(),
  },
};

const Template = (args) => {
  mockLanguageHook(args);
  return <SectionTeamPlayers {...args} />;
};

export const Default = Template.bind({});

Default.args = {
  players: mockPlayers(6),
  team: mockTeams(2, 3).A,
};
