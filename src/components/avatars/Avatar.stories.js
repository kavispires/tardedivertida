import { AVAILABLE_AVATAR_IDS } from 'utils/avatars';
import { Avatar } from './Avatar';
import { getLanguageControl, mockLanguageHook } from 'mocks/storybook-helpers';

export default {
  title: 'avatar/Avatar',
  component: Avatar,
  argTypes: {
    ...getLanguageControl(),
    alt: { control: 'text' },
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

const Template = (args) => {
  mockLanguageHook(args);
  return <Avatar {...args} />;
};

export const Default = Template.bind({});

Default.args = {
  className: '',
  id: '3',
  shape: 'circle',
  size: 'large',
};
