// Ant Design Resources
import { QuestionCircleFilled } from '@ant-design/icons';
import { Flex } from 'antd';
// Components
import { Translate } from 'components/language/Translate';
import { TextHighlight } from 'components/text/TextHighlight';
// Internal
import { ImpostorHighlight } from './Highlights';

export function ImposterTitle() {
  return (
    <Flex
      align="center"
      gap={8}
    >
      <Translate
        pt="A pista secreta é"
        en="The secret clue is"
      />{' '}
      <TextHighlight>
        <QuestionCircleFilled />
      </TextHighlight>{' '}
      <Translate
        pt="Você é o impostor!"
        en="You are the impostor!"
      />
      <ImpostorHighlight> </ImpostorHighlight>
    </Flex>
  );
}

export function SecretClueTitle({ clue }: { clue: string }) {
  return (
    <Flex
      align="center"
      gap={8}
    >
      <Translate
        pt="A pista secreta é"
        en="The secret clue is"
      />{' '}
      <TextHighlight>{clue}</TextHighlight>
    </Flex>
  );
}

export function RevealedClueTitle({ clue }: { clue: string }) {
  return (
    <Flex
      align="center"
      gap={8}
    >
      <Translate
        pt="Pista Secreta era: "
        en="The Secret Clue was: "
      />
      <TextHighlight>{clue}</TextHighlight>
    </Flex>
  );
}
