import {
  CheckCircleFilled,
  EnvironmentOutlined,
  ExceptionOutlined,
  GiftOutlined,
  SafetyOutlined,
} from '@ant-design/icons';
import { Select } from 'antd';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { Avatar, Translate } from '../../components';
import { useLanguage } from '../../hooks';
import { AVATARS } from '../../utils/constants';
import { ItemCard } from './ItemCard';

type CrimeProps = {
  user: GamePlayer;
  players: GamePlayers;
  scenes: ScenesDict;
  scenesOrder: string[];
  crime: Crime;
  items: ItemsDict;
  evidences: CrimesHediondosCard[];
  weapons: CrimesHediondosCard[];
  onUpdateGuesses?: GenericFunction;
  showAnswers?: boolean;
};

export function Crime({
  crime,
  players,
  scenesOrder,
  scenes,
  user,
  items,
  weapons,
  evidences,
  onUpdateGuesses,
  showAnswers = false,
}: CrimeProps) {
  const player = players[crime.playerId];
  const [selections, setSelections] = useState<PlainObject>({});

  const onSelect = (e: any) => {
    const newSelections = {
      ...selections,
      [e.type]: e.itemId,
    };

    setSelections(newSelections);
    onUpdateGuesses!({ ...newSelections, playerId: player.id });
  };

  const isComplete = selections.weapon && selections.evidence;

  return (
    <div className="h-crime">
      <div className="h-crime__player" style={{ backgroundColor: AVATARS[player.avatarId].color }}>
        <span className="h-crime__player-avatar">
          <Avatar id={player.avatarId} />
        </span>
        <span className="h-crime__player-name">{player.name}</span>
      </div>

      <div className="h-crime__scenes">
        {scenesOrder
          .filter((sceneId) => crime.scenes[sceneId] !== undefined)
          .map((sceneId) => {
            const scene = scenes[sceneId];

            return (
              <CrimeScene
                key={`crime-scene-${sceneId}-by-${crime.playerId}`}
                scene={scene}
                playerIndex={crime.scenes[sceneId]}
              />
            );
          })}
      </div>

      <div className="h-crime-selections">
        <ItemSelector
          user={user}
          items={items}
          itemsList={weapons}
          type={'weapon'}
          onSelect={onSelect}
          playerId={player.id}
          hideSelector={!Boolean(onUpdateGuesses)}
          itemId={showAnswers ? crime.weaponId : undefined}
        />

        <ItemSelector
          user={user}
          items={items}
          itemsList={evidences}
          type={'evidence'}
          onSelect={onSelect}
          playerId={player.id}
          hideSelector={!Boolean(onUpdateGuesses)}
          itemId={showAnswers ? crime.evidenceId : undefined}
        />
      </div>

      <div
        className="h-crime__player"
        style={{ backgroundColor: isComplete ? AVATARS[player.avatarId].color : undefined }}
      >
        {isComplete && <CheckCircleFilled />}
      </div>
    </div>
  );
}

type CrimeSceneProps = {
  scene: SceneTile;
  playerIndex: number;
};

function CrimeScene({ scene, playerIndex }: CrimeSceneProps) {
  const { language } = useLanguage();
  return (
    <li className={clsx('h-crime-scene', `h-crime-scene--${scene.type}`)}>
      <div className={clsx('h-crime-scene__label', `h-crime-scene__label--${scene.type}`)}>
        <CrimeSceneIcon type={scene.type} /> {scene.title[language]}
      </div>
      <div className="h-crime-scene__value">{scene.values[playerIndex][language]}</div>
    </li>
  );
}

type CrimeSceneIconProps = {
  type: string;
};

function CrimeSceneIcon({ type }: CrimeSceneIconProps) {
  switch (type) {
    case 'cause':
      return <SafetyOutlined />;
    case 'evidence':
      return <GiftOutlined />;
    case 'location':
      return <EnvironmentOutlined />;
    default:
      return <ExceptionOutlined />;
  }
}

type ItemSelectorProps = {
  user: GamePlayer;
  items: ItemsDict;
  itemsList: CrimesHediondosCard[];
  type: 'weapon' | 'evidence';
  onSelect: GenericFunction;
  playerId: PlayerId;
  hideSelector?: boolean;
  itemId?: string;
};

function ItemSelector({
  items,
  itemsList,
  user,
  type,
  onSelect,
  playerId,
  hideSelector = false,
  itemId,
}: ItemSelectorProps) {
  const [selectedItem, setSelected] = useState<CrimesHediondosCard>();
  const { language } = useLanguage();

  useEffect(() => {
    if (itemId) {
      setSelected(items[itemId]);
    } else {
      if (user.id === playerId) {
        setSelected(items[user[`${type}Id`]]);
      } else {
        setSelected(items[user.guesses?.[playerId]?.[type]]);
      }
    }
  }, []); //eslint-disable-line

  const onSetSelected = (itemId: string) => {
    setSelected(itemsList.find((i) => i.id === itemId));
    onSelect({
      playerId,
      type,
      itemId,
    });
  };

  return (
    <div className="h-item-selector">
      {!hideSelector && (
        <Select
          defaultValue={user.guesses?.[playerId]?.[type] || ''}
          onChange={onSetSelected}
          style={{ width: '100px' }}
        >
          <Select.Option value="" disabled>
            {type === 'weapon' ? (
              <Translate pt="Arma" en="Weapon" />
            ) : (
              <Translate pt="Evidência" en="Evidence" />
            )}
          </Select.Option>
          {itemsList.map((item) => (
            <Select.Option key={item.id} value={item.id}>
              {item.name[language].toUpperCase()}
            </Select.Option>
          ))}
        </Select>
      )}

      {selectedItem && <ItemCard item={selectedItem} cardWidth={100} preview />}
    </div>
  );
}
