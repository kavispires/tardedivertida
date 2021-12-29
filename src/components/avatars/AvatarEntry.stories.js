import { getLanguageControl, mockLanguageHook } from '../../mocks';
import { AVAILABLE_AVATAR_IDS } from '../../utils/constants';

import { AvatarEntry } from './AvatarEntry';

export default {
  title: 'avatar/AvatarEntry',
  component: AvatarEntry,
  argTypes: {
    ...getLanguageControl(),
    id: {
      control: 'inline-radio',
      options: AVAILABLE_AVATAR_IDS,
    },
    name: { control: 'text' },
  },
};

const Template = (args) => {
  mockLanguageHook(args);
  return <AvatarEntry {...args} />;
};

export const Default = Template.bind({});

Default.args = {
  className: '',
  id: '6',
  animate: false,
};
