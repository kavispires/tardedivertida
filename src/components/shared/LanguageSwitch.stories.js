import { useLanguage } from 'hooks';

import { LanguageSwitch } from './LanguageSwitch';

export default {
  title: 'shared/LanguageSwitch',
  component: LanguageSwitch,
  argTypes: {},
};

const Template = (args) => {
  const { translate } = useLanguage();

  return (
    <div>
      <LanguageSwitch {...args} />
      <p>{translate('Este texto é em Português', 'This text is in English')}</p>
    </div>
  );
};

export const Default = Template.bind({});
