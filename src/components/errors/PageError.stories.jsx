import React from 'react';
import { mockLoading } from '../../mocks';

import { PageError } from './PageError';

export default {
  title: 'errors/PageError',
  component: PageError,
  argTypes: {},
};

const Template = (args) => {
  mockLoading();
  return <PageError {...args} />;
};

export const Default = Template.bind({});
