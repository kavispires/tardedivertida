// Ant Design Resources
import { Button, Space } from 'antd';
// Hooks
import { useLoading } from 'hooks/useLoading';
import { useMock } from 'hooks/useMock';
// Components
import { Card } from 'components/cards';
import { GroupQuestionCard } from 'components/cards/GroupQuestionCard';
import { Translate } from 'components/language';
import { Instruction } from 'components/text';
// Internal
import type { TrackProps } from '../../utils/types';
import { mockSelection } from '../../utils/mock';
import { MinigameTitle } from '../MinigameTitle';
// AntDesign Resources

export const TrackMenteColetiva = ({ track, round, onSubmitAnswer, user }: TrackProps) => {
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
      <Space direction="vertical" align="center" className="space-container contained margin">
        <Instruction contained>
          <Translate
            pt="Qual das respostas provavelmente viria na sua cabeça primeiro ao ver a pergunta?"
            en="Which of the answers would probably come to your mind first when you see the question?"
          />
        </Instruction>

        <Space className="space-container">
          <Card className="m-question-wrapper" color="yellow">
            <GroupQuestionCard question={track.data.question} overrideNumber={2} />
          </Card>
        </Space>

        <Space className="space-container" wrap>
          {track.data.options.map((option: string) => (
            <Button key={option} onClick={() => onSubmit(option)} size="large" disabled={isLoading}>
              {option}
            </Button>
          ))}
        </Space>
      </Space>
    </>
  );
};
