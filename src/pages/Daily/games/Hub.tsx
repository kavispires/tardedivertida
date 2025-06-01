import clsx from 'clsx';
import { motion } from 'framer-motion';
import moment from 'moment';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTimer } from 'react-timer-hook';
// Ant Design Resources
import { MutedOutlined, SoundFilled } from '@ant-design/icons';
import { Alert, Button, Divider, Switch, Typography } from 'antd';
// Hooks
import { useCardWidthByContainerRef } from 'hooks/useCardWidth';
import { useCurrentUserContext } from 'hooks/useCurrentUserContext';
import { useGlobalLocalStorage } from 'hooks/useGlobalLocalStorage';
// Utils
import { getAnimation } from 'utils/animations';
import { isDevEnv } from 'utils/helpers';
// Icons
import { DailyContributionGame } from 'icons/DailyContributionGame';
import { DailyCrimeGameIcon } from 'icons/DailyCrimeGameIcon';
import { SpeechBubbleAcceptedIcon } from 'icons/SpeechBubbleAcceptedIcon';
// Components
import { IconAvatar } from 'components/avatars';
import { DualTranslate, LanguageSwitch, Translate } from 'components/language';
// Internal
import { dailySoundEffects, playSFX, SFXAllNames } from '../utils/soundEffects';
import type { GameSettings } from '../utils/types';
import { SETTINGS } from '../utils/settings';
import { DailyChrome } from '../components/DailyChrome';
import { checkWasPlayedToday, daysSinceRelease, getToday, hasBeenReleased } from '../utils';

type Entry = GameSettings & {
  disabled?: boolean;
};

const COMING_SOON_ENTRY: Entry = {
  KEY: '',
  ROUTE: '',
  RELEASE_DATE: moment().add(1, 'year').format('YYYY-MM-DD'),
  EMOJI: '',
  COLOR: '',
  HUB_ICON: DailyContributionGame,
  HUB_NAME: { pt: '', en: '' },
  NAME: { pt: '', en: '' },
  TAGLINE: { pt: '', en: '' },
  disabled: true,
};

const GAMES: Entry[] = [
  SETTINGS.ARTE_RUIM,
  SETTINGS.COMUNICACAO_ALIENIGENA,
  SETTINGS.AQUI_O,
  SETTINGS.TEORIA_DE_CONJUNTOS,
  SETTINGS.CONTROLE_DE_ESTOQUE,
  SETTINGS.FILMACO,
  SETTINGS.PALAVREADO,
  SETTINGS.PORTAIS_MAGICOS,
  SETTINGS.QUARTETOS,
  SETTINGS.ORGANIKU,
  SETTINGS.ESPIONAGEM,
  {
    ...COMING_SOON_ENTRY,
    HUB_ICON: DailyCrimeGameIcon,
    HUB_NAME: { pt: 'Criminologia', en: 'Criminology' },
    COLOR: 'rgba(243, 232, 145, 0.85)',
    VERSION: 'disabled',
  },
];

const CONTRIBUTIONS: Entry[] = [
  SETTINGS.PICACO,
  SETTINGS.TA_NA_CARA,
  // {
  //   ...COMING_SOON_ENTRY,
  //   HUB_ICON: DailyContributionGame,
  //   HUB_NAME: { pt: 'Responda', en: 'Answer' },
  //   COLOR: 'rgba(240, 240, 228, 0.85)',
  //   disabled: true,
  // },
];

export function Hub() {
  const { isAdmin } = useCurrentUserContext();
  const [width, ref] = useCardWidthByContainerRef(3, { maxWidth: 128, minWidth: 48, gap: 16 });
  const today = getToday();

  return (
    <DailyChrome>
      <div className="menu menu--hub">
        <LanguageSwitch />
        <TimeLeft />
        <SoundFX />
      </div>
      <div className="hub" ref={ref}>
        <Typography.Title level={5}>
          <Translate pt="Jogue" en="Play" />
        </Typography.Title>

        <HubList list={GAMES} width={width} startingIndex={0} />
      </div>
      <div className="hub">
        <Typography.Title level={5}>
          <Translate pt="Contribua" en="Contribute" />
        </Typography.Title>

        <HubList list={CONTRIBUTIONS} width={width} startingIndex={GAMES.length} />
      </div>

      {isAdmin && (
        <Alert
          style={{ marginTop: '64px' }}
          showIcon={false}
          message={
            <>
              <Link to="debug">Debug</Link> <Divider type="vertical" />{' '}
              <a
                href={`${import.meta.env.VITE__FIRESTORE_URL}/${import.meta.env.VITE__FIREBASE_PROJECT_ID}/${import.meta.env.VITE__FIRESTORE_PATH}/~2Fdiario~2F${today}`}
                target="_blank"
                rel="noreferrer"
              >
                Firestore
              </a>
            </>
          }
          type="info"
          banner
        />
      )}
      <SFXTest />
    </DailyChrome>
  );
}

type HubListProps = {
  list: (GameSettings & { disabled?: boolean })[];
  width: number;
  startingIndex: number;
};

function HubList({ list, width, startingIndex }: HubListProps) {
  return (
    <div className="hub-list">
      {list.map(
        ({ KEY, ROUTE, HUB_ICON, HUB_NAME, COLOR, RELEASE_DATE, VERSION = 'stable', disabled }, index) => (
          <GameButton
            key={KEY}
            lsKey={KEY}
            width={width}
            href={ROUTE}
            Icon={HUB_ICON}
            name={HUB_NAME}
            color={COLOR}
            version={VERSION}
            releaseDate={RELEASE_DATE}
            disabled={
              disabled || ['disabled', 'maintenance'].includes(VERSION) || hasBeenReleased(RELEASE_DATE)
            }
            index={startingIndex + index}
          />
        ),
      )}
      {Array.from({ length: (3 - (list.length % 3)) % 3 }).map((_, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: non important
        <div key={index} style={{ width }} className="hub-item-placeholder" />
      ))}
    </div>
  );
}

type GameButtonProps = {
  lsKey: string;
  width: number;
  disabled?: boolean;
  href: string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  name: DualLanguageValue;
  color: string;
  releaseDate: string;
  index: number;
  version: GameSettings['VERSION'];
};

function GameButton({
  lsKey,
  width,
  disabled,
  href,
  Icon,
  name,
  color,
  releaseDate,
  index,
  version = 'stable',
}: GameButtonProps) {
  const wasPlayed = checkWasPlayedToday(lsKey);

  const isNewRelease =
    daysSinceRelease(releaseDate) < 15 &&
    daysSinceRelease(releaseDate) >= 0 &&
    !wasPlayed &&
    releaseDate !== 'DEMO';

  return (
    <motion.div className="played-wrapper">
      {wasPlayed && (
        <IconAvatar icon={<SpeechBubbleAcceptedIcon />} size="small" className="played-wrapper__played" />
      )}
      {version === 'demo' && <div className="played-wrapper__demo">Demo</div>}
      {version === 'soon' && (
        <div className="played-wrapper__soon">
          <DualTranslate>{{ en: 'Soon', pt: 'Em breve' }}</DualTranslate>
        </div>
      )}

      <motion.div
        className="played-wrapper"
        {...(isNewRelease ? getAnimation('tada', { repeat: 10, delay: 0.1 * index, speed: 'fast' }) : {})}
      >
        <motion.button
          className={clsx('transparent-button', 'hub-item', disabled && 'hub-item--disabled')}
          style={{ width, height: width, backgroundColor: color }}
          {...getAnimation('bounceIn', { delay: index * 0.05 })}
          disabled={disabled}
          onClick={() => playSFX('swap')}
        >
          <Link to={`/diario/${href}`} className="hub-link">
            <Icon style={{ width: width / 2 }} />
            <DualTranslate>{name}</DualTranslate>
          </Link>
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

function SoundFX() {
  const [volume, setVolume] = useGlobalLocalStorage('volume');

  useEffect(() => {
    dailySoundEffects.volume(volume);
  }, [volume]);

  const onSwitchClick = (checked: boolean) => {
    setVolume(checked ? 0.5 : 0);
  };

  return (
    <Switch
      checkedChildren={<SoundFilled />}
      unCheckedChildren={<MutedOutlined />}
      checked={!!volume}
      onClick={onSwitchClick}
    />
  );
}

function TimeLeft() {
  // Get the next midnight timestamp
  const getNextMidnight = () => {
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0); // Set to midnight of the next day
    return midnight;
  };

  const { seconds, minutes, hours, restart } = useTimer({
    expiryTimestamp: getNextMidnight(),
    onExpire: () => restart(getNextMidnight()), // Restart the timer when it reaches 0
  });

  return (
    <div className="hub-time-left">
      <span key={`h${hours}`}>{String(hours).padStart(2, '0')}</span>:
      <span key={`m${minutes}`}>{String(minutes).padStart(2, '0')}</span>:
      <span key={`s${seconds}`}>{String(seconds).padStart(2, '0')}</span>
    </div>
  );
}

function SFXTest() {
  if (isDevEnv) {
    return (
      <div className="hub-list">
        {SFXAllNames.map((name) => (
          <Button key={name} onClick={() => dailySoundEffects.play(name)} block>
            {name}
          </Button>
        ))}
      </div>
    );
  }
  return null;
}
