import clsx from 'clsx';
// Ant Design Resources
import { Avatar as AntAvatar, Button } from 'antd';
import {
  CheckCircleFilled,
  ClockCircleFilled,
  EnvironmentOutlined,
  ExceptionOutlined,
  GiftOutlined,
  SafetyOutlined,
} from '@ant-design/icons';
// Hooks
import { useLanguage } from 'hooks';
// Utils
import { getAvatarColorById } from 'utils/helpers';
// Components
import { Avatar, Translate } from 'components';
import { ItemCard } from './ItemCard';
import { ItemCardEmpty } from './ItemCardEmpty';
import { Tooltip } from 'antd';
import { useState } from 'react';
import { CrimeGuessStatus } from './CrimeGuessStatus';

const CARD_WIDTH = 100;

type CrimeProps = {
  history?: GuessHistoryEntry[];
  crime: Crime;
  items: ItemsDict;
  player: GamePlayer;
  scenes: ScenesDict;
  scenesOrder: string[];
  selectedWeaponId?: CardId;
  selectedEvidenceId?: CardId;
};

export function Crime({
  crime,
  player,
  scenesOrder,
  scenes,
  selectedWeaponId,
  selectedEvidenceId,
  history,
  items,
}: CrimeProps) {
  const [historyEntryIndex, setHistoryEntryIndex] = useState(-1);
  const isComplete = Boolean(selectedWeaponId && selectedWeaponId);

  const activeWeaponId =
    historyEntryIndex >= 0 && history ? history[historyEntryIndex].weaponId : selectedWeaponId;

  const evidenceWeaponId =
    historyEntryIndex >= 0 && history ? history[historyEntryIndex].evidenceId : selectedEvidenceId;

  //
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

      <div className="h-crime__history">
        <Tooltip
          title={
            <Translate pt="Histórico: passe o mouse nas rodadas" en="History: hover the round numbers" />
          }
        >
          <ClockCircleFilled />
        </Tooltip>
        {history?.map((entry, index) => {
          return (
            <Button
              ghost
              shape="circle"
              size="small"
              onMouseOver={() => setHistoryEntryIndex(index)}
              onMouseLeave={() => setHistoryEntryIndex(-1)}
            >
              {index + 1}
            </Button>
          );
        })}
      </div>

      <div className="h-crime-selections">
        {activeWeaponId ? (
          <ItemCard item={items[activeWeaponId]} cardWidth={CARD_WIDTH} preview />
        ) : (
          <ItemCardEmpty cardWidth={CARD_WIDTH} cardType="weapon" />
        )}

        {evidenceWeaponId ? (
          <ItemCard item={items[evidenceWeaponId]} cardWidth={CARD_WIDTH} preview />
        ) : (
          <ItemCardEmpty cardWidth={CARD_WIDTH} cardType="evidence" />
        )}

        <div className="h-crime-selections__status">
          {historyEntryIndex >= 0 && history && history[historyEntryIndex] && (
            <CrimeGuessStatus status={history[historyEntryIndex].status} />
          )}
        </div>
      </div>

      <div
        className="h-crime__player"
        style={{ backgroundColor: isComplete ? getAvatarColorById(player.avatarId) : undefined }}
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
