import React from 'react';
import { AVAILABLE_AVATAR_IDS } from '../../utils/constants';

import { Avatar } from './Avatar';

export default {
  title: 'Avatar/Avatar',
  component: Avatar,
  argTypes: {
    id: {
      control: 'inline-radio',
      options: AVAILABLE_AVATAR_IDS,
    },
    shape: {
      control: 'inline-radio',
      options: ['circle', 'square'],
    },
    size: {
      control: 'inline-radio',
      options: ['small', 'default', 'large'],
    },
  },
};

const Template = (args) => <Avatar {...args} />;

export const Default = Template.bind({});

Default.args = {
  alt: 'Fulano',
  className: '',
  id: '3',
  shape: 'circle',
  size: 'large',
};
