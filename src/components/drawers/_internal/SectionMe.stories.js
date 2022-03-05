import { getLanguageControl, mockLanguageHook, mockPlayer } from 'mocks';

import { SectionMe } from './SectionMe';

export default {
  title: 'drawers/_private/SectionMe',
  component: SectionMe,
  argTypes: {
    ...getLanguageControl(),
    isTeamGame: { control: 'boolean' },
  },
};

const Template = (args) => {
  mockLanguageHook(args);
  return <SectionMe {...args} />;
};

export const Default = Template.bind({});

Default.args = {
  player: mockPlayer(),
};

export const WithTeamGame = Template.bind({});

WithTeamGame.args = {
  player: mockPlayer({ team: 'A' }),
  isTeamGame: true,
};
