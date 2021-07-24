import React from 'react';
import { getLanguageControl, mockLanguageHook, mockPlayers } from '../../../mocks';

import { SectionRankedPlayers } from './SectionRankedPlayers';

export default {
  title: 'drawers/_private/SectionRankedPlayers',
  component: SectionRankedPlayers,
  argTypes: {
    ...getLanguageControl(),
  },
};

const Template = (args) => {
  mockLanguageHook(args);
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
