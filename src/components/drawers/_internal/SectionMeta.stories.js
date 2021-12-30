import { getLanguageControl, mockLanguageHook } from '../../../mocks';

import { SectionMeta } from './SectionMeta';

export default {
  title: 'drawers/_private/SectionMeta',
  component: SectionMeta,
  argTypes: {
    ...getLanguageControl(),
    round: { control: 'number' },
    roundsToEndGame: { control: 'number' },
    groupScore: { control: 'number' },
  },
};

const Template = (args) => {
  mockLanguageHook(args);
  return <SectionMeta {...args} />;
};

export const Default = Template.bind({});

Default.args = {
  round: 1,
};

export const WithRoundsToEngGame = Template.bind({});

WithRoundsToEngGame.args = {
  round: 1,
  roundsToEndGame: 9,
};

export const WithGroupScore = Template.bind({});

WithGroupScore.args = {
  round: 1,
  groupScore: 79,
};

export const WithTeams = Template.bind({});

WithTeams.args = {
  round: 1,
  teams: {
    A: { score: 3 },
    B: { score: 7 },
  },
  pointsToVictory: 3,
  isTeamGame: true,
};

export const WithPointsToVictory = Template.bind({});

WithPointsToVictory.args = {
  round: 1,
  pointsToVictory: 19,
  isTeamGame: false,
};
