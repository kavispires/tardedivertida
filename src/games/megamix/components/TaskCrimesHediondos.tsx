import clsx from 'clsx';
// AntDesign Resources
import { Button, Popover, Tag } from 'antd';
import { CheckCircleFilled } from '@ant-design/icons';
// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
import { useLanguage } from 'hooks/useLanguage';
import { useLoading } from 'hooks/useLoading';
import { useMock } from 'hooks/useMock';
// Utils
import { mockSelection } from '../utils/mock';
// Components
import { ImageCard } from 'components/cards';
import { DualTranslate, Translate } from 'components/language';
import { Instruction } from 'components/text';
import { MinigameTitle } from './MinigameTitle';

export const TaskCrimesHediondos = ({ task, round, onSubmitTask, user, players }: TaskProps) => {
  const cardWidth = useCardWidth(12, { minWidth: 100, maxWidth: 130 });
  const { dualTranslate } = useLanguage();
  const { isLoading } = useLoading();

  // DEV Mock
  useMock(() => {
    onSubmitTask({
      data: { value: mockSelection(task.data.cards, 'id') },
    });
  });

  return (
    <>
      <MinigameTitle round={round} task={task} />
      <Instruction contained>
        <Translate
          pt={
            <>
              O médico legista examinou o crime e chegou às conclusões abaixo.
              <br />
              Selecione qual {task.variant === 'weapon' ? 'armas' : 'evidencias'} você acha que foi usada no
              crime.
            </>
          }
          en={
            <>
              The forensic scientist examined the body and came to those conclusions below.
              <br />
              Select the one {task.variant} you think took part in the crime.
            </>
          }
        />
      </Instruction>

      <ul className="h-table">
        {Boolean(task.data.scenes.causeOfDeath) && (
          <SceneTile tile={task.data.scenes.causeOfDeath} index={task.data.crimeIndexes.causeOfDeath} />
        )}
        {Boolean(task.data.scenes.reasonForEvidence) && (
          <SceneTile
            tile={task.data.scenes.reasonForEvidence}
            index={task.data.crimeIndexes.reasonForEvidence}
          />
        )}

        <SceneTile tile={task.data.scenes.location} index={task.data.crimeIndexes.location} />
        <SceneTile tile={task.data.scenes.sceneA} index={task.data.crimeIndexes.sceneA} />
        <SceneTile tile={task.data.scenes.sceneB} index={task.data.crimeIndexes.sceneB} />
        <SceneTile tile={task.data.scenes.sceneC} index={task.data.crimeIndexes.sceneC} />
      </ul>

      <ul className="h-cards">
        {task.data.cards.map((card: HCard) => {
          return (
            <li
              className={clsx('h-item-card', user?.data?.value === card.id && 'h-item-card--selected')}
              key={card.id}
            >
              <Popover content={dualTranslate(card.name).toUpperCase()}>
                <Tag
                  className="h-item-card__name"
                  color={card.type === 'weapon' ? 'geekblue' : 'volcano'}
                  style={{ maxWidth: `${cardWidth + 16}px` }}
                >
                  <span>
                    <DualTranslate>{card.name}</DualTranslate>
                  </span>
                </Tag>
              </Popover>
              <ImageCard imageId={card.id} cardWidth={cardWidth} className="h-item-card__image" />
              <Button
                shape="round"
                type="primary"
                disabled={user.ready}
                loading={isLoading}
                onClick={() =>
                  onSubmitTask({
                    data: { value: card.id },
                  })
                }
              >
                <Translate pt="Selecionar" en="Select" />
              </Button>
            </li>
          );
        })}
      </ul>
    </>
  );
};

type SceneTileProps = {
  tile: SceneTile;
  index: number;
};

function SceneTile({ tile, index }: SceneTileProps) {
  const { dualTranslate } = useLanguage();
  return (
    <li className={clsx('h-scene-tile', `h-scene-tile--${tile.type}`)}>
      <Popover content={dualTranslate(tile.description)}>
        <h4 className="h-scene-tile__title">{dualTranslate(tile.title)}</h4>
      </Popover>
      <ul className="h-scene-tile__options">
        {tile.values.map((entry, i) => {
          const isActive = i === index;
          return (
            <li
              key={`${tile.id}-value-${i}`}
              className={clsx(
                'h-scene-tile__item',
                `h-scene-tile__item--${tile.type}`,
                isActive && 'h-scene-tile__item--active'
              )}
            >
              {isActive && <CheckCircleFilled className="h-scene-tile__icon" />}
              {dualTranslate(entry)}
            </li>
          );
        })}
      </ul>
    </li>
  );
}
