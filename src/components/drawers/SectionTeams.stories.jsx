import React from 'react';
import { mockPlayers, mockTeams } from '../../mocks';

import { SectionTeams } from './SectionTeams';

export default {
  title: 'Drawers/_Private/SectionTeams',
  component: SectionTeams,
  argTypes: {},
};

const Template = (args) => {
  return <SectionTeams {...args} />;
};

export const Default = Template.bind({});

Default.args = {
  players: mockPlayers(6),
  teams: mockTeams(2, 3),
};
