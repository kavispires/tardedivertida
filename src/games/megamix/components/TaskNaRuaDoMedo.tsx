// AntDesign Resources
import { Avatar, Button, Space } from 'antd';
// Hooks
import { useLoading } from 'hooks/useLoading';
import { useMock } from 'hooks/useMock';
// Utils
import { mockSelection } from '../utils/mock';
// Components
import { Translate } from 'components/language';
import { Instruction } from 'components/text';
import { MinigameTitle } from './MinigameTitle';
import { TransparentButton } from 'components/buttons';
import { HouseCard } from 'games/na-rua-do-medo/components/HouseCard';

export const TaskNaRuaDoMedo = ({ task, round, onSubmitTask, user }: TaskProps) => {
  const { isLoading } = useLoading();

  const onSelect = (value: string) => {
    onSubmitTask({
      data: { value },
    });
  };

  // DEV Mock
  useMock(() => {
    onSelect(
      task.variant === 'kids'
        ? mockSelection(['0', '1'])
        : mockSelection(task.data.options.map((h: NCard) => h.id))
    );
  });

  if (task.variant === 'kids') {
    return (
      <>
        <MinigameTitle round={round} task={task} />
        <Instruction contained>
          <Translate
            pt={
              <>
                Estamos indo de porta em porta buscar doces...
                <br />
                Mas qual rua devemos ir? A rua com mais doces? A rua com menos medo?
              </>
            }
            en={
              <>
                We're trick-or-treating...
                <br />
                Which street should we hit first? The one with more candy? The one with less horror?
              </>
            }
          />
        </Instruction>

        <Space className="space-container" direction="vertical">
          <TransparentButton
            className="n-street"
            disabled={user.ready || isLoading}
            onClick={() => onSelect('0')}
          >
            <Avatar>A</Avatar>
            <div className="n-street__houses">
              {task.data.options['0'].map((house: NCard) => (
                <HouseCard key={`A-${house.id}`} card={house} candyLeftover={0} preview={false} />
              ))}
            </div>
          </TransparentButton>
          <TransparentButton
            className="n-street"
            disabled={user.ready || isLoading}
            onClick={() => onSelect('1')}
          >
            <Avatar>B</Avatar>
            <div className="n-street__houses">
              {task.data.options['1'].map((house: NCard) => (
                <HouseCard key={`B-${house.id}`} card={house} candyLeftover={0} preview={false} />
              ))}
            </div>
          </TransparentButton>
        </Space>
      </>
    );
  }

  return (
    <>
      <MinigameTitle round={round} task={task} />
      <Instruction contained>
        <Translate
          pt={
            <>
              Você estava tranquilo em casa e <strong>6 crianças</strong> apareceram na sua porta. Qual das
              opções você escolheria para dar pra eles? Assustar ou guloseimas?
            </>
          }
          en={
            <>
              You are hanging out at home and <strong>6 kids</strong> showed up at our door. Which of the
              options do you choose to give to them? Scare 'em or give treats?
            </>
          }
        />
      </Instruction>

      <Space className="space-container">
        {task.data.options.map((house: NCard) => (
          <Space direction="vertical" key={house.id} className="space-container n-street-house">
            <HouseCard card={house} candyLeftover={0} preview={false} />
            <Button
              shape="round"
              type="primary"
              disabled={user.ready || isLoading}
              onClick={() => onSelect(house.id)}
              loading={isLoading}
            >
              <Translate pt="Selecionar" en="Select" />
            </Button>
          </Space>
        ))}
      </Space>
    </>
  );
};