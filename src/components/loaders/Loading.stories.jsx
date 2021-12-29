import { Loading } from './Loading';

export default {
  title: 'Loaders/Loading',
  component: Loading,
  argTypes: {
    message: { control: 'text' },
  },
};

const Template = (args) => <Loading {...args} />;

export const Default = Template.bind({});

export const WithText = Template.bind({});

WithText.args = {
  message: 'Schirming...',
};
