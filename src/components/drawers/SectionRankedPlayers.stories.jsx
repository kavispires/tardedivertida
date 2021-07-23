import React from 'react';
import { mockPlayers } from '../../mocks';

import { SectionRankedPlayers } from './SectionRankedPlayers';

export default {
  title: 'drawers/_Private/SectionRankedPlayers',
  component: SectionRankedPlayers,
  argTypes: {},
};

const Template = (args) => {
  return <SectionRankedPlayers {...args} />;
};

export const Default = Template.bind({});

Default.args = {
  players: mockPlayers(6, true),
};

export const WithoutScore = Template.bind({});

WithoutScore.args = {
  players: mockPlayers(6),
};
