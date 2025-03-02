import Markdown from 'react-markdown';
// Ant Design Resources
import { Flex } from 'antd';
// Components
import { Step } from 'components/steps';
import { StepTitle } from 'components/text';
// Internal
import { DEMO } from './cards/demo';
import { EscapeRoomCard } from './cards/EscapeRoomCard';

const allCards = Object.values(DEMO.cards);

export function EscapeRoomDemo() {
  return (
    <Step>
      <StepTitle>Sample Episode</StepTitle>
      <Markdown>## **Hi**, *Pluto*!</Markdown>
      <Flex gap={8} wrap>
        {allCards.map((card) => (
          <EscapeRoomCard key={card.id} card={card} width={200} onPlayCard={(id) => console.log(id)} />
        ))}
      </Flex>
    </Step>
  );
}
