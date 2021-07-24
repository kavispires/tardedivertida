import React from 'react';
import { getLanguageControl, mockGlobalUser, mockLanguageHook, mockPlayers, mockTeams } from '../../mocks';

import { GameInfoDrawer } from './GameInfoDrawer';

export default {
  title: 'drawers/GameInfoDrawer',
  component: GameInfoDrawer,
  argTypes: {
    ...getLanguageControl(),
  },
};

const Template = (args) => {
  mockLanguageHook(args);
  mockGlobalUser();
  return <GameInfoDrawer {...args} />;
};

const mockedState = {
  phase: 'SOMETHING',
  round: 1,
  pointsToVictory: 1,
};
const mockedInfo = {
  title: 'Game Title',
  description: '',
};
const defaultArgs = {
  userId: '_bob',
  players: mockPlayers(8, true, true),
  state: mockedState,
  info: mockedInfo,
};

export const Default = Template.bind({});

Default.args = {
  ...defaultArgs,
};

export const CoopGame = Template.bind({});

CoopGame.args = {
  ...defaultArgs,
  state: {
    ...mockedState,
    groupScore: 9,
  },
};

export const TwoTeams = Template.bind({});

TwoTeams.args = {
  ...defaultArgs,
  state: {
    ...mockedState,
    teams: mockTeams(2, 4),
  },
};

export const ThreeTeams = Template.bind({});

ThreeTeams.args = {
  ...defaultArgs,
  players: mockPlayers(6, true, true),
  state: {
    ...mockedState,
    teams: mockTeams(3, 2),
  },
};
