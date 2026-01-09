// Ant Design Resources
import { Button } from 'antd';
// Hooks
import { useLoading } from 'hooks/useLoading';
import { useMock } from 'hooks/useMock';
// Components
import { Card } from 'components/cards';
import { GroupQuestionCard } from 'components/cards/GroupQuestionCard';
import { Translate } from 'components/language';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { RuleInstruction } from 'components/text';
// Internal
import type { TrackProps } from '../../utils/types';
import { mockSelection } from '../../utils/mock';
import { MinigameTitle } from '../MinigameTitle';

export const TrackMenteColetiva = ({ track, onSubmitAnswer }: TrackProps) => {
  const { isLoading } = useLoading();

  const onSubmit = (answer: string) => {
    onSubmitAnswer({
      data: { value: answer },
    });
  };

  // DEV Mock
  useMock(() => {
    onSubmit(mockSelection(track.data.options));
  });

  return (
    <>
      <MinigameTitle title={{ pt: 'Mente Coletiva', en: 'Herd Mind' }} />
      <SpaceContainer
        vertical
        contained
        className="margin"
      >
        <RuleInstruction type="action">
          <Translate
            pt="Qual das respostas provavelmente viria na sua cabeça primeiro ao ver a pergunta?"
            en="Which of the answers would probably come to your mind first when you see the question?"
          />
        </RuleInstruction>

        <SpaceContainer>
          <Card
            className="m-question-wrapper"
            color="yellow"
          >
            <GroupQuestionCard
              question={track.data.question}
              overrideNumber={2}
            />
          </Card>
        </SpaceContainer>

        <SpaceContainer wrap>
          {track.data.options.map((option: string) => (
            <Button
              key={option}
              onClick={() => onSubmit(option)}
              size="large"
              disabled={isLoading}
            >
              {option}
            </Button>
          ))}
        </SpaceContainer>
      </SpaceContainer>
    </>
  );
};
