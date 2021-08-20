import React from 'react';

import CloudBackground from './CloudBackground';

export default {
  title: 'lobby/_private/CloudBackground',
  component: CloudBackground,
  argTypes: {
    type: {
      control: 'select',
      options: ['cloud', 'cyber-cloud', 'funky-cloud', 'detective-cloud', 'artsy-cloud'],
    },
  },
};

const Template = (args) => <CloudBackground {...args} />;

export const Default = Template.bind({});
