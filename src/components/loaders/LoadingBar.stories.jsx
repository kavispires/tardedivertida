import { mockLoading } from '../../mocks';

import { LoadingBar } from './LoadingBar';

export default {
  title: 'Loaders/Loading Bar',
  component: LoadingBar,
  argTypes: {
    _withLoading: { control: 'boolean', defaultValue: 'true' },
  },
};

const Template = (args) => {
  mockLoading(args._withLoading);
  return <LoadingBar {...args} />;
};

export const Default = Template.bind({});
