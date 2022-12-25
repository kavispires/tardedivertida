import { Space } from 'antd';

import { Card } from 'components/cards';
import { Translate } from 'components/language';
import { Instruction } from 'components/text';
import { useLanguage } from 'hooks/useLanguage';
import { useLoading } from 'hooks/useLoading';
import { MinigameTitle } from './MinigameTitle';
import { useMock } from 'hooks/useMock';
import { mockSelection } from '../utils/mock';
import { SkiingIcon } from 'components/icons/SkiingIcon';
import { IconAvatar } from 'components/icons/IconAvatar';
import { TransparentButton } from 'components/buttons';
import { SnowHillIcon } from 'components/icons/SnowHillIcon';

export const TaskDilemaDosEsquiadores = ({ task, round, onSubmitTask, user }: TaskProps) => {
  const { translate } = useLanguage();
  const { isLoading } = useLoading();

  const onSelect = (value: string) => {
    onSubmitTask({
      data: { value },
    });
  };

  // DEV Mock
  useMock(() => {
    onSelect(mockSelection([task.data.dilemma.left, task.data.dilemma.right]));
  });

  return (
    <>
      <MinigameTitle round={round} task={task} />
      <Instruction contained>
        <Translate
          pt={
            <>
              Você tem os pensamentos mais filosóficos quando você está esquiando ladeira abaixo.
              <br />
              Selecione a opção apropriada para a questão séria:
            </>
          }
          en={
            <>
              You have the most philosophical shower thoughts while skiing
              <br />
              Select the best option below:
            </>
          }
        />
      </Instruction>

      <Space className="space-container" direction="vertical">
        <div className="dd-animated-skiier">
          <IconAvatar icon={<SkiingIcon />} size={84} />
        </div>
        <Card header={translate('Dica', 'Clue')} color="red">
          {task.data.dilemma.prompt}
        </Card>

        <Space className="space-container">
          <div className="dd-buttons">
            <TransparentButton
              onClick={() => onSelect(task.data.dilemma.left)}
              disabled={user.ready || isLoading}
              className="dd-button"
            >
              <span className="dd-button__hill dd-button__hill--left">
                <IconAvatar icon={<SnowHillIcon />} size={64} />
              </span>
              <span className="dd-button__text">{task.data.dilemma.left}</span>
            </TransparentButton>
            <TransparentButton
              onClick={() => onSelect(task.data.dilemma.right)}
              disabled={user.ready || isLoading}
              className="dd-button"
            >
              <span className="dd-button__hill">
                <IconAvatar icon={<SnowHillIcon />} size={64} />
              </span>
              <span className="dd-button__text">{task.data.dilemma.right}</span>
            </TransparentButton>
          </div>
        </Space>
      </Space>
    </>
  );
};
