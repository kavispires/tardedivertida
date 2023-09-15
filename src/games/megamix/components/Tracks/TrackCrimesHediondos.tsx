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
import { mockSelection } from '../../utils/mock';
// Components
import { ImageCard } from 'components/cards';
import { DualTranslate, Translate } from 'components/language';
import { Instruction } from 'components/text';
import { MinigameTitle } from '../MinigameTitle';

export const TrackCrimesHediondos = ({ track, round, onSubmitAnswer, user, players }: TrackProps) => {
  const cardWidth = useCardWidth(12, { minWidth: 100, maxWidth: 130 });
  const { dualTranslate } = useLanguage();
  const { isLoading } = useLoading();

  // DEV Mock
  useMock(() => {
    onSubmitAnswer({
      data: { value: mockSelection(track.data.cards, 'id') },
    });
  });

  return (
    <>
      <MinigameTitle title={{ pt: '', en: '' }} />
      <Instruction contained>
        <Translate
          pt={
            <>
              O médico legista examinou o crime e chegou às conclusões abaixo.
              <br />
              Selecione qual {track.variant === 'weapon' ? 'armas' : 'evidencias'} você acha que foi usada no
              crime.
            </>
          }
          en={
            <>
              The forensic scientist examined the body and came to those conclusions below.
              <br />
              Select the one {track.variant} you think took part in the crime.
            </>
          }
        />
      </Instruction>

      <ul className="h-table">
        {Boolean(track.data.scenes.causeOfDeath) && (
          <SceneTile tile={track.data.scenes.causeOfDeath} index={track.data.crimeIndexes.causeOfDeath} />
        )}
        {Boolean(track.data.scenes.reasonForEvidence) && (
          <SceneTile
            tile={track.data.scenes.reasonForEvidence}
            index={track.data.crimeIndexes.reasonForEvidence}
          />
        )}

        <SceneTile tile={track.data.scenes.location} index={track.data.crimeIndexes.location} />
        <SceneTile tile={track.data.scenes.sceneA} index={track.data.crimeIndexes.sceneA} />
        <SceneTile tile={track.data.scenes.sceneB} index={track.data.crimeIndexes.sceneB} />
        <SceneTile tile={track.data.scenes.sceneC} index={track.data.crimeIndexes.sceneC} />
      </ul>

      <ul className="h-cards">
        {track.data.cards.map((card: HCard) => {
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
                  onSubmitAnswer({
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
