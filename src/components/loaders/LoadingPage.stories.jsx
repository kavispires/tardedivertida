import React from 'react';

import { LoadingPage } from './LoadingPage';

export default {
  title: 'Loaders/Loading Page',
  component: LoadingPage,
  argTypes: {
    message: { control: 'text' },
  },
};

const Template = (args) => {
  return <LoadingPage {...args} />;
};

export const Default = Template.bind({});
