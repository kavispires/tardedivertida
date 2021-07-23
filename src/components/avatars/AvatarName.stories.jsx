import React from 'react';
import { mockGlobalUser, mockPlayer } from '../../mocks';

import { AvatarName } from './AvatarName';

export default {
  title: 'Avatar/AvatarName',
  component: AvatarName,
  argTypes: {
    size: {
      control: 'inline-radio',
      options: ['small', 'default', 'large'],
    },
  },
};

const Template = (args) => {
  mockGlobalUser();
  return <AvatarName {...args} />;
};

export const Default = Template.bind({});

Default.args = {
  player: mockPlayer(),
  addressUser: false,
  className: '',
  size: 'default',
  uppercase: false,
  withDescription: false,
};

export const AddressUser = Template.bind({});

AddressUser.args = {
  ...Default.args,
  addressUser: true,
};

export const withDescription = Template.bind({});

withDescription.args = {
  ...Default.args,
  withDescription: true,
};
