// AntDesign Resources
import { Button, Space } from 'antd';
// Hooks
import { useLoading } from 'hooks/useLoading';
import { useMock } from 'hooks/useMock';
// Utils
import { mockSelection } from '../utils/mock';
// Components
import { Translate } from 'components/language';
import { Instruction } from 'components/text';
import { MinigameTitle } from './MinigameTitle';
import { SocialProfile } from './SocialProfile';

export const TaskPolemicaDaVez = ({ task, round, onSubmitTask, user }: TaskProps) => {
  const { isLoading } = useLoading();

  const onSelect = (value: number) => {
    onSubmitTask({
      data: { value: String(value) },
    });
  };

  // DEV Mock
  useMock(() => {
    onSelect(mockSelection(task.data.options));
  });

  return (
    <>
      <MinigameTitle round={round} task={task} />
      <Instruction contained>
        <Translate
          pt={<>Observe o tópico abaixo, quantas curtidas você acha que ele ganhou?</>}
          en={<>How many likes did this trending topic get?</>}
        />
      </Instruction>

      <div className="tweet">
        <SocialProfile avatarId="A" name="Bob" handle="@bob" verified />
        <span className="tweet__text">{task.data.card.text}</span>
      </div>

      <Space className="space-container">
        {task.data.options.map((option: number) => {
          return (
            <Button
              key={`option-${option}`}
              onClick={() => onSelect(option)}
              size="large"
              disabled={isLoading || user.ready}
              type="primary"
              shape="circle"
            >
              {option}
            </Button>
          );
        })}
      </Space>
    </>
  );
};
