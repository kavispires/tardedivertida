import { mockPlayers } from '../../mocks';

import { WaitingRoom } from './WaitingRoom';

export default {
  title: 'shared/WaitingRoom',
  component: WaitingRoom,
  argTypes: {},
};

const Template = (args) => {
  return <WaitingRoom {...args}>{args.children}</WaitingRoom>;
};

export const Default = Template.bind({});

Default.args = {
  title: 'Here is the title',
  instruction: 'Here is the instruction',
  children: 'Here are the children',
  players: mockPlayers(5, true),
};
