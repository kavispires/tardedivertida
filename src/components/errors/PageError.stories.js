import { getLanguageControl, mockLanguageHook, mockLoading } from 'mocks';

import { PageError } from './PageError';

export default {
  title: 'errors/PageError',
  component: PageError,
  argTypes: {
    ...getLanguageControl(),
  },
};

const Template = (args) => {
  mockLanguageHook(args);
  mockLoading();
  return <PageError {...args} />;
};

export const Default = Template.bind({});

export const WithCustomText = Template.bind({});

WithCustomText.args = {
  message: 'Wubba Lubba Dub Dub',
  description: 'This is the description',
};
