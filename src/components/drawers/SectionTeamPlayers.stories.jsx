import React from 'react';
import { mockPlayers, mockTeams } from '../../mocks';

import { SectionTeamPlayers } from './SectionTeamPlayers';

export default {
  title: 'drawers/_Private/SectionTeamPlayers',
  component: SectionTeamPlayers,
  argTypes: {},
};

const Template = (args) => {
  return <SectionTeamPlayers {...args} />;
};

export const Default = Template.bind({});

Default.args = {
  players: mockPlayers(6),
  team: mockTeams(2, 3).A,
};
