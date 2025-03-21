// Ant Design Resources
import { InfoCircleOutlined } from '@ant-design/icons';
import { Flex, Popover, Tag } from 'antd';
// Components
import { Translate } from 'components/language';
import { Container } from 'components/layout/Container';
import { Instruction } from 'components/text';
// Internal
import type { WordLength } from '../utils/types';
import { WORD_LENGTH_STATUS } from '../utils/constants';

type WordLengthProps = {
  wordLengths: WordLength[];
  highlightLength?: number;
  phase?: string;
};

export function WordLengths({ wordLengths, highlightLength, phase }: WordLengthProps) {
  const getColor = (status: keyof typeof WORD_LENGTH_STATUS) => {
    return {
      [WORD_LENGTH_STATUS.ENDANGERED]: 'red-inverse',
      [WORD_LENGTH_STATUS.AVAILABLE]: 'green',
      [WORD_LENGTH_STATUS.FAILED]: 'red',
      [WORD_LENGTH_STATUS.SOLVED]: 'black',
    }[status];
  };
  const lengths = wordLengths.filter((wl) => wl.status !== WORD_LENGTH_STATUS.SOLVED);
  const hasEndangered = lengths.some((wl) => wl.status === WORD_LENGTH_STATUS.ENDANGERED);

  return (
    <Instruction contained>
      <Container
        title={
          <>
            {phase === 'WORD_CREATION' ? (
              <Translate en="Word Lengths Available" pt="Comprimentos de Palavras Disponíveis" />
            ) : (
              <Translate en="Remaining Word Lengths" pt="Comprimentos de Palavras Restantes" />
            )}
            :{' '}
            <Popover
              content={
                <Translate
                  en="TThe goal is to create a new portmanteau word with the given lengths."
                  pt="O objetivo é criar uma nova palavra-valise com os comprimentos fornecidos."
                />
              }
              title={<Translate en="Word Lengths" pt="Comprimentos de Palavras" />}
              trigger="click"
            >
              <InfoCircleOutlined />
            </Popover>
          </>
        }
        contentProps={{
          direction: 'vertical',
        }}
      >
        <Flex justify="center" gap={16}>
          {lengths.map((wl) => (
            <Tag
              key={wl.wordLength}
              color={highlightLength === wl.wordLength ? 'gold-inverse' : getColor(wl.status)}
            >
              {wl.wordLength}
            </Tag>
          ))}
          {lengths.length === 0 && <Translate en="No lengths left" pt="Nenhum comprimento restante!" />}
        </Flex>
        {hasEndangered && (
          <Instruction contained>
            <InfoCircleOutlined />{' '}
            <Translate
              pt="Comprimentos em vermelho, se não forem adivinhados corretamente encerram o jogo."
              en="Red lengths, if not guessed correctly, end the game."
            />
          </Instruction>
        )}
      </Container>
    </Instruction>
  );
}
