// AntDesign Resources
import { Button, Space } from 'antd';
// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
import { useLoading } from 'hooks/useLoading';
import { useMock } from 'hooks/useMock';
// Utils
import { mockSelection } from '../utils/mock';
// Components
import { Translate } from 'components/language';
import { Instruction } from 'components/text';
import { MinigameTitle } from './MinigameTitle';
import { CanvasSVG } from 'components/canvas';
import { MonsterCard } from 'components/cards/MonsterCard';

export const TaskRetratoFalado = ({ task, round, onSubmitTask, user, players }: TaskProps) => {
  const cardWidth = useCardWidth(5, 32, 250, 270);
  const { isLoading } = useLoading();

  const onSelect = (value: string) => {
    onSubmitTask({
      data: { value },
    });
  };

  // DEV Mock
  useMock(() => {
    onSelect(mockSelection(task.data.options, 'playerId'));
  });

  return (
    <>
      <MinigameTitle round={round} task={task} />
      <Instruction contained>
        <Translate
          pt={
            <>
              Dentre as ilustrações abaixo, qual melhor ilustra o mostro?
              <br />
              Foi você quem desenhou? Você pode votar em si mesmo se quiser.
            </>
          }
          en={
            <>
              Among the illustrations below, which one best illustrates the monster?
              <br />
              Is that your drawing? You may vote for yourself if you want.
            </>
          }
        />
      </Instruction>

      <Space className="space-container">
        <MonsterCard currentMonster={task.data.card} showControls cardWidth={250} />
      </Space>

      <div className="a-drawings">
        {task.data.options.map((entry: PlainObject) => (
          <div className="a-drawings__entry" key={entry.playerId}>
            <CanvasSVG drawing={entry.drawing} width={cardWidth} className="a-drawing" />

            <Space className="space-container">
              <Button
                shape="round"
                type="primary"
                disabled={user.ready}
                loading={isLoading}
                onClick={() => onSelect(entry.playerId)}
              >
                <Translate pt="Selecionar" en="Select" />
              </Button>
            </Space>
          </div>
        ))}
      </div>
    </>
  );
};
