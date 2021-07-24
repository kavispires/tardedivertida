import React from 'react';
import { mockHooks, mockInfo } from '../../mocks';

import { PhaseContainer } from './PhaseContainer';

export default {
  title: 'shared/PhaseContainer',
  component: PhaseContainer,
  argTypes: {
    fullScreen: { control: 'boolean', defaultValue: false },
    white: { control: 'boolean', defaultValue: false },
  },
};

const Template = (args) => {
  const hookedArgs = mockHooks(args);
  return <PhaseContainer {...hookedArgs} />;
};

export const Default = Template.bind({});

Default.args = {
  info: mockInfo(),
  phase: 'PHASE',
  allowedPhase: 'PHASE',
  children: 'Content Comes Here',
};

export const NoInfo = Template.bind({});

NoInfo.args = {
  info: {},
  children: 'Content Comes Here',
};

export const NoPhase = Template.bind({});

NoPhase.args = {
  info: mockInfo(),
  phase: null,
  allowedPhase: null,
  children: 'Content Comes Here',
};
