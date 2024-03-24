import { Divider, Typography } from 'antd';
import { useLoading } from 'hooks/useLoading';
import { Solutions } from '../utils/types';
import { Translate } from 'components/language';
import { CircleHighlight } from './Highlights';
import { YesNoSwitch } from './YesNoSwitch';

type SolutionProps = {
  solutions: Solutions;
  attribute?: string;
  word?: string;
  context?: string;
  setAttribute?: (value: string) => void;
  setWord?: (value: string) => void;
  setContext?: (value: string) => void;
};

export function Solution({
  solutions,
  attribute,
  word,
  context,
  setAttribute,
  setWord,
  setContext,
}: SolutionProps) {
  const { isLoading } = useLoading();

  return (
    <div>
      <Typography.Paragraph>
        <CircleHighlight color="blue">
          <Translate en="Attribute" pt="Atributo" />
        </CircleHighlight>
        {solutions.attribute.text}
        {!!setAttribute && (
          <>
            {' '}
            <YesNoSwitch
              loading={isLoading}
              checked={!!attribute}
              onChange={(checked) => setAttribute(checked ? 'A' : '')}
            />
          </>
        )}
      </Typography.Paragraph>
      <Divider />
      <Typography.Paragraph>
        <CircleHighlight color="gold">
          <Translate en="Word" pt="Palavra" />
        </CircleHighlight>
        {solutions.word.text}
        {!!setWord && (
          <>
            {' '}
            <YesNoSwitch
              loading={isLoading}
              checked={!!word}
              onChange={(checked) => setWord(checked ? 'W' : '')}
            />
          </>
        )}
      </Typography.Paragraph>
      {solutions.context && (
        <>
          <Divider />
          <Typography.Paragraph>
            <CircleHighlight color="red">
              <Translate en="Context" pt="Contexto" />
            </CircleHighlight>
            {solutions.context.text}
            {!!setContext && (
              <>
                {' '}
                <YesNoSwitch
                  loading={isLoading}
                  checked={!!context}
                  onChange={(checked) => setContext(checked ? 'C' : '')}
                />
              </>
            )}
          </Typography.Paragraph>
        </>
      )}
    </div>
  );
}
