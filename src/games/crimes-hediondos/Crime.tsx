import { useState } from 'react';
import clsx from 'clsx';
// Ant Design Resources
import { Button, Tooltip } from 'antd';
import {
  CheckCircleFilled,
  ClockCircleFilled,
  EnvironmentOutlined,
  ExceptionOutlined,
  GiftOutlined,
  LockFilled,
  SafetyOutlined,
} from '@ant-design/icons';
// Hooks
import { useLanguage } from 'hooks';
// Utils
import { getAvatarColorById } from 'utils/helpers';
// Components
import { Avatar } from 'components/avatars';
import { Translate } from 'components/language';
import { ItemCard } from './ItemCard';
import { ItemCardEmpty } from './ItemCardEmpty';
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
  isLocked?: boolean;
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
  isLocked,
}: CrimeProps) {
  const [historyEntryIndex, setHistoryEntryIndex] = useState(-1);
  const isComplete = Boolean(selectedWeaponId && selectedWeaponId);

  const activeWeaponId =
    historyEntryIndex >= 0 && history ? history[historyEntryIndex].weaponId : selectedWeaponId;

  const evidenceWeaponId =
    historyEntryIndex >= 0 && history ? history[historyEntryIndex].evidenceId : selectedEvidenceId;

  const color = getAvatarColorById(player.avatarId);
  const hasHistory = history && history.length;

  return (
    <div className="h-crime">
      <div className="h-crime__player" style={{ backgroundColor: color }}>
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

      <div className="h-crime__history" style={{ borderColor: hasHistory ? color : 'transparent' }}>
        {hasHistory && (
          <>
            <div className="h-crime__history-header">
              <Tooltip
                title={
                  <Translate
                    pt="Histórico: passe o mouse nas rodadas"
                    en="History: hover the round numbers"
                  />
                }
              >
                <ClockCircleFilled />
              </Tooltip>
            </div>
            {history?.map((_, index) => {
              return (
                <Button
                  key={`history-entry-${index}`}
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
          </>
        )}
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
          {historyEntryIndex === -1 && isLocked && <CrimeGuessStatus status="LOCKED" />}
        </div>
      </div>

      <div className="h-crime__player" style={{ backgroundColor: isComplete ? color : undefined }}>
        {isLocked && <LockFilled />}
        {!isLocked && isComplete && <CheckCircleFilled />}
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
