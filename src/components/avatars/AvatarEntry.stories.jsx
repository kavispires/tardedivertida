import React from 'react';
import { AVAILABLE_AVATAR_IDS } from '../../utils/constants';

import { AvatarEntry } from './AvatarEntry';

export default {
  title: 'Avatar/AvatarEntry',
  component: AvatarEntry,
  argTypes: {
    id: {
      control: 'inline-radio',
      options: AVAILABLE_AVATAR_IDS,
    },
  },
};

const Template = (args) => <AvatarEntry {...args} />;

export const Default = Template.bind({});

Default.args = {
  className: '',
  id: '6',
  name: 'Fulano',
  animate: false,
};
