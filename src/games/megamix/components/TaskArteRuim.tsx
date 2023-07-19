// AntDesign Resources
import { Button, Space } from 'antd';
// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
import { useLoading } from 'hooks/useLoading';
import { useMock } from 'hooks/useMock';
// Utils
import { LETTERS } from 'utils/constants';
import { getColorFromIndex } from 'utils/helpers';
import { mockSelection } from '../utils/mock';
// Components
import { Card } from 'components/cards';
import { Translate } from 'components/language';
import { Instruction } from 'components/text';
import { MinigameTitle } from './MinigameTitle';
import { CanvasSVG } from 'components/canvas';
import { TransparentButton } from 'components/buttons';

export const TaskArteRuim = ({ task, round, onSubmitTask, user, players }: TaskProps) => {
  const cardWidth = useCardWidth(5, {
    minWidth: 250,
    maxWidth: 270,
  });
  const { isLoading } = useLoading();

  const onSelect = (value: string) => {
    onSubmitTask({
      data: { value },
    });
  };

  // DEV Mock
  useMock(() => {
    if (task.variant === 'cards') {
      onSelect(mockSelection(task.data.cards, 'id'));
    }

    if (task.variant === 'drawings') {
      onSelect(mockSelection(task.data.options, 'playerId'));
    }
  });

  if (task.variant === 'cards') {
    return (
      <>
        <MinigameTitle round={round} task={task} />
        <Instruction contained>
          <Translate
            pt={
              <>
                Dentre as cartas abaixo, qual melhor descreve essa linda ilustração?
                <br />
                Foi você quem desenhou? Lembre-se que a resposta correta não é importante, e sim o que a
                maioria escolher.
              </>
            }
            en={
              <>
                Among the cards below, which one best describes the beautiful illustration?
                <br />
                <em>
                  Is that your drawing? Remember that the correct answer is not important, but what the
                  majority will choose.
                </em>
              </>
            }
          />
        </Instruction>

        <Space className="space-container">
          <CanvasSVG drawing={task.data.option.drawing} width={cardWidth} className="a-drawing" />
        </Space>

        <Space className="space-container">
          {task.data.cards.map((card: TextCard, index: number) => (
            <TransparentButton
              key={card.id}
              disabled={isLoading || user.ready}
              onClick={() =>
                onSubmitTask({
                  data: { value: card.id },
                })
              }
            >
              <Card header={LETTERS[index]} color={getColorFromIndex(index)}>
                {card.text}
              </Card>
            </TransparentButton>
          ))}
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
              Dentre as ilustrações abaixo, qual melhor descreve a carta?
              <br />
              Foi você quem desenhou? Lembre-se que a resposta correta não é importante, e sim o que a maioria
              escolher.
            </>
          }
          en={
            <>
              Among the illustrations below, which one best fits the card?
              <br />
              <em>
                Is that your drawing? Remember that the correct answer is not important, but what the majority
                will choose.
              </em>
            </>
          }
        />
      </Instruction>

      <Space className="space-container">
        <Card header="A" color={getColorFromIndex(0)}>
          {task.data.cards[1].text}
        </Card>
      </Space>

      <div className="a-drawings">
        {task.data.options.map((entry: PlainObject) => (
          <div className="a-drawings__entry">
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
