// Ant Design Resources
import { QuestionCircleFilled } from '@ant-design/icons';
import { Flex } from 'antd';
// Components
import { Translate } from 'components/language';
import { TextHighlight } from 'components/text';

export function ImposterTitle() {
  return (
    <Flex align="center" gap={8}>
      <Translate pt="A pista secreta é" en="The secret clue is" />{' '}
      <TextHighlight>
        <QuestionCircleFilled />
      </TextHighlight>{' '}
      <Translate pt="Você é o impostor!" en="You are the impostor!" />
    </Flex>
  );
}

export function SecretClueTitle({ clue }: { clue: string }) {
  return (
    <Flex align="center" gap={8}>
      <Translate pt="A pista secreta é" en="The secret clue is" /> <TextHighlight>{clue}</TextHighlight>
    </Flex>
  );
}

export function RevealedClueTitle({ clue }: { clue: string }) {
  return (
    <Flex align="center" gap={8}>
      <Translate pt="Pista Secreta era: " en="The Secret Clue was: " />
      <TextHighlight>{clue}</TextHighlight>
    </Flex>
  );
}
