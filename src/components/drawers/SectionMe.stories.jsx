import React from 'react';
import { mockPlayer } from '../../mocks';

import { SectionMe } from './SectionMe';

export default {
  title: 'drawers/_Private/SectionMe',
  component: SectionMe,
  argTypes: {
    isTeamGame: { control: 'boolean' },
  },
};

const Template = (args) => {
  return <SectionMe {...args} />;
};

export const Default = Template.bind({});

Default.args = {
  player: mockPlayer(),
};

export const WithTeamGame = Template.bind({});

WithTeamGame.args = {
  player: mockPlayer({ team: 'A' }),
  isTeamGame: true,
};
