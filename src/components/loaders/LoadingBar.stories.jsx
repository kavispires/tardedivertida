import React from 'react';
import { mockLoading } from '../../mocks';

import { LoadingBar } from './LoadingBar';

export default {
  title: 'Loaders/Loading Bar',
  component: LoadingBar,
  argTypes: {},
};

const Template = (args) => {
  mockLoading();
  return <LoadingBar {...args} />;
};

export const Default = Template.bind({});
