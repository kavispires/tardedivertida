import {
  CheckCircleFilled,
  EnvironmentOutlined,
  ExceptionOutlined,
  GiftOutlined,
  SafetyOutlined,
} from '@ant-design/icons';
import clsx from 'clsx';
import { Avatar } from '../../components';
import { useLanguage } from '../../hooks';
import { getAvatarColorById } from '../../utils/helpers';
import { ItemCard } from './ItemCard';

type CrimeProps = {
  user: GamePlayer;
  crime: Crime;
  items: ItemsDict;
  players: GamePlayers;
  scenes: ScenesDict;
  scenesOrder: string[];
  selections: Guess;
  weapons: HCard[];
  evidences: HCard[];
};

export function Crime({ crime, players, scenesOrder, scenes, selections, user, items }: CrimeProps) {
  const player = players[crime.playerId];

  return (
    <div className="h-crime">
      <div className="h-crime__player" style={{ backgroundColor: getAvatarColorById(player.avatarId) }}>
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
        <ItemCard item={items[selections?.weaponId ?? user.weaponId]} cardWidth={100} preview />

        <ItemCard item={items[selections?.evidenceId ?? user.evidenceId]} cardWidth={100} preview />
      </div>

      <div
        className="h-crime__player"
        style={{ backgroundColor: selections?.isComplete ? getAvatarColorById(player.avatarId) : undefined }}
      >
        {selections?.isComplete && <CheckCircleFilled />}
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
