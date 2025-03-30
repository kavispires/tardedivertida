import clsx from 'clsx';
import { useState } from 'react';
// Ant Design Resources
import {
  CheckCircleFilled,
  ClockCircleFilled,
  EnvironmentOutlined,
  ExceptionOutlined,
  GiftOutlined,
  LockFilled,
  SafetyOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
// Types
import type { GamePlayer } from 'types/player';
import type { CrimeSceneTile } from 'types/tdr';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Utils
import { getAvatarColorById } from 'utils/helpers';
// Icons
import { BoxBlankIcon } from 'icons/BoxBlankIcon';
// Components
import { Avatar, IconAvatar } from 'components/avatars';
import { CrimeItemCard } from 'components/cards/CrimeItemCard';
import { Translate } from 'components/language';
// Internal
import type { Crime, GuessHistoryEntry, ItemsDict, ScenesDict } from '../utils/types';
import { ItemCardEmpty } from './ItemCardEmpty';
import { CrimeGuessStatus } from './CrimeGuessStatus';

const CARD_WIDTH = 100;

type CrimeSummaryProps = {
  history?: GuessHistoryEntry[];
  crime: Crime;
  items: ItemsDict;
  player: GamePlayer;
  scenes: ScenesDict;
  scenesOrder: string[];
  selectedWeaponId?: CardId;
  selectedEvidenceId?: CardId;
  selectedVictimId?: CardId;
  selectedLocationId?: CardId;
  isLocked?: boolean;
  isVictimGame: boolean;
  isLocationGame: boolean;
};

export function CrimeSummary({
  crime,
  player,
  scenesOrder,
  scenes,
  selectedWeaponId,
  selectedEvidenceId,
  selectedVictimId,
  selectedLocationId,
  history,
  items,
  isLocked,
  isVictimGame,
  isLocationGame,
}: CrimeSummaryProps) {
  const [historyEntryIndex, setHistoryEntryIndex] = useState(-1);
  const isComplete =
    Boolean(selectedWeaponId && selectedWeaponId) &&
    (isVictimGame ? selectedVictimId : true) &&
    (isLocationGame ? selectedLocationId : true);

  const activeWeaponId =
    historyEntryIndex >= 0 && history ? history[historyEntryIndex].weaponId : selectedWeaponId;

  const activeEvidenceId =
    historyEntryIndex >= 0 && history ? history[historyEntryIndex].evidenceId : selectedEvidenceId;

  const activeVictimId =
    historyEntryIndex >= 0 && history ? history[historyEntryIndex].victimId : selectedVictimId;

  const activeLocationId =
    historyEntryIndex >= 0 && history ? history[historyEntryIndex].locationId : selectedLocationId;

  const color = getAvatarColorById(player.avatarId);
  const hasHistory = history?.length;

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
          <CrimeItemCard item={items[activeWeaponId]} cardWidth={CARD_WIDTH} />
        ) : (
          <ItemCardEmpty cardWidth={CARD_WIDTH} cardType="weapon" />
        )}

        {activeEvidenceId ? (
          <CrimeItemCard item={items[activeEvidenceId]} cardWidth={CARD_WIDTH} />
        ) : (
          <ItemCardEmpty cardWidth={CARD_WIDTH} cardType="evidence" />
        )}

        {isVictimGame &&
          (activeVictimId ? (
            <CrimeItemCard item={items[activeVictimId]} cardWidth={CARD_WIDTH} />
          ) : (
            <ItemCardEmpty cardWidth={CARD_WIDTH} cardType="victim" />
          ))}

        {isLocationGame &&
          (activeLocationId ? (
            <CrimeItemCard item={items[activeLocationId]} cardWidth={CARD_WIDTH} />
          ) : (
            <ItemCardEmpty cardWidth={CARD_WIDTH} cardType="location" />
          ))}

        <div className="h-crime-selections__status">
          {historyEntryIndex >= 0 && history && history[historyEntryIndex] && (
            <CrimeGuessStatus status={history[historyEntryIndex].status} />
          )}
          {historyEntryIndex === -1 && isLocked && <CrimeGuessStatus status="LOCKED" />}
          {historyEntryIndex === -1 && (
            <span className="crime-guess-status">
              <IconAvatar icon={<BoxBlankIcon />} className="invisible" />
            </span>
          )}
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
  scene: CrimeSceneTile;
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
    case 'victim':
      return <UserOutlined />;
    default:
      return <ExceptionOutlined />;
  }
}
