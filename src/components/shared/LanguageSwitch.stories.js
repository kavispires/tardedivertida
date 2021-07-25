import React from 'react';
import { useLanguage } from '../../hooks';

import { LanguageSwitch } from './LanguageSwitch';
import { translate } from './Translate';

export default {
  title: 'shared/LanguageSwitch',
  component: LanguageSwitch,
  argTypes: {},
};

const Template = (args) => {
  const language = useLanguage();

  return (
    <div>
      <LanguageSwitch {...args} />
      <p>{translate('Este texto é em Português', 'This text is in English', language)}</p>
    </div>
  );
};

export const Default = Template.bind({});
