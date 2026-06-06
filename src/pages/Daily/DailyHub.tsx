import clsx from 'clsx';
import { addYears, format } from 'date-fns';
import { orderBy } from 'lodash';
import { motion } from 'motion/react';
import { useTimer } from 'react-timer-hook';
// Ant Design Resources
import { Alert, Divider, Flex, Space, Typography } from 'antd';
// Hooks
import { useCardWidthByContainerRef } from 'hooks/useCardWidth';
import { useCurrentUserContext } from 'hooks/useCurrentUserContext';
// Services
import { getFirestoreConsoleUrl, logAnalyticsEvent } from 'services/firebase';
// Utils
import { getAnimation } from 'utils/animations';
import { getToday } from 'utils/helpers';
// Icons
import { DailyContributionGameIcon } from 'icons/DailyContributionGameIcon';
import { SpeechBubbleAcceptedIcon } from 'icons/SpeechBubbleAcceptedIcon';
// Components
import { IconAvatar } from 'components/avatars/IconAvatar';
import { DualTranslate } from 'components/language/DualTranslate';
import { Translate } from 'components/language/Translate';
// Internal
import { playSFX } from './utils/soundEffects';
import type { GameSettings } from './utils/types';
import { ALL_SETTINGS } from './utils/settings';
import { DailyChrome } from './components/DailyChrome';
import { News } from './components/News';
import { BundleResults } from './components/BundleResults';
import { StreakDisplay } from './components/StreakDisplay';
import { StreakMilestoneModal } from './components/StreakMilestoneModal';
import { HubDevTools } from './components/HubDevTools';
import { SoundFXToggle } from './components/SoundFXToggle';
import { checkWasPlayedToday, daysSinceRelease, hasBeenReleased } from './utils';
import { useStreakMilestone } from './hooks/useStreakData';
import { useDailyChallengeContext } from './hooks/useDailyChallengeContext';

type Entry = GameSettings & {
  disabled?: boolean;
};

const _COMING_SOON_ENTRY: Entry = {
  KEY: '',
  ROUTE: '',
  TYPE: 'game',
  RELEASE_DATE: format(addYears(new Date(), 1), 'yyyy-MM-dd'),
  VERSION: 'soon',
  EMOJI: '',
  COLOR: '',
  HUB_ICON: DailyContributionGameIcon,
  NAME: { pt: '', en: '' },
  TAGLINE: { pt: '', en: '' },
  disabled: true,
};

type Libraries = {
  NEW_RELEASES: Entry[];
  GAMES: Entry[];
  CONTRIBUTIONS: Entry[];
  DEMOS: Entry[];
  SPECIALS: Entry[];
  SHAREABLE: Entry[];
};

// Get NEW_RELEASES, GAMES, CONTRIBUTIONS, DEMOS and SPECIALS from ALL_SETTINGS
const { NEW_RELEASES, GAMES, CONTRIBUTIONS, DEMOS, SPECIALS, SHAREABLE } = Object.values(ALL_SETTINGS).reduce(
  (acc: Libraries, settings) => {
    if (
      settings.TYPE === 'game' &&
      ['stable', 'beta'].includes(settings.VERSION ?? '') &&
      !hasBeenReleased(settings.RELEASE_DATE)
    ) {
      acc.SHAREABLE.push(settings);
      acc.SHAREABLE = orderBy(acc.SHAREABLE, ['NAME.pt'], ['asc']);
    }

    if (
      settings.RELEASE_DATE &&
      settings.VERSION !== 'demo' &&
      daysSinceRelease(settings.RELEASE_DATE) < 15
    ) {
      acc.NEW_RELEASES.push(settings);
      acc.NEW_RELEASES = orderBy(acc.NEW_RELEASES, [(e) => daysSinceRelease(e.RELEASE_DATE)], ['desc']);
      return acc;
    }

    if (settings.TYPE === 'contribution') {
      acc.CONTRIBUTIONS.push(settings);
      acc.CONTRIBUTIONS = orderBy(acc.CONTRIBUTIONS, ['NAME.pt'], ['asc']);
      return acc;
    }

    if (settings.VERSION === 'demo') {
      acc.DEMOS.push(settings);
      acc.DEMOS = orderBy(acc.DEMOS, ['NAME.pt'], ['asc']);
      return acc;
    }

    if (settings.TYPE === 'game') {
      acc.GAMES.push(settings);
      acc.GAMES = orderBy(acc.GAMES, ['NAME.pt'], ['asc']);
      return acc;
    }

    if (settings.TYPE === 'special') {
      acc.SPECIALS.push(settings);
      acc.SPECIALS = orderBy(acc.SPECIALS, ['NAME.pt'], ['asc']);
      return acc;
    }

    return acc;
  },
  {
    NEW_RELEASES: [],
    GAMES: [],
    CONTRIBUTIONS: [],
    DEMOS: [],
    SPECIALS: [],
    SHAREABLE: [],
  },
);

export function Hub() {
  const { isAdmin } = useCurrentUserContext();
  const { setActiveGame } = useDailyChallengeContext();
  const [width, ref] = useCardWidthByContainerRef(3, { maxWidth: 128, minWidth: 48, gap: 16 });
  const today = getToday();
  const { milestone, onClose } = useStreakMilestone();

  return (
    <DailyChrome>
      <div className="menu menu--hub">
        <News />
        <Flex
          align="center"
          gap={6}
        >
          <TimeLeft />
          <SoundFXToggle />
        </Flex>
        <StreakDisplay />
      </div>

      {NEW_RELEASES.length > 0 && (
        <div className="hub">
          <Typography.Title level={5}>
            <Translate
              pt="Lançamentos"
              en="New Releases"
            />
          </Typography.Title>

          <HubList
            list={NEW_RELEASES}
            width={width}
            startingIndex={GAMES.length}
          />
        </div>
      )}

      <div
        className="hub"
        ref={ref}
      >
        <Typography.Title level={5}>
          <Translate
            pt="Jogue"
            en="Play"
          />
        </Typography.Title>

        <HubList
          list={GAMES}
          width={width}
          startingIndex={0}
        />
      </div>

      <BundleResults list={SHAREABLE} />

      <div className="hub">
        <Typography.Title level={5}>
          <Translate
            pt="Contribua"
            en="Contribute"
          />
        </Typography.Title>

        <HubList
          list={CONTRIBUTIONS}
          width={width}
          startingIndex={GAMES.length}
        />
      </div>

      {DEMOS.length > 0 && (
        <div className="hub">
          <Typography.Title level={5}>
            <Translate
              pt="Demos"
              en="Demos"
            />
          </Typography.Title>

          <HubList
            list={DEMOS}
            width={width}
            startingIndex={GAMES.length}
          />
        </div>
      )}

      {SPECIALS.length > 0 && (
        <div className="hub">
          <Typography.Title level={5}>
            <Translate
              pt="Especiais"
              en="Specials"
            />
          </Typography.Title>

          <HubList
            list={SPECIALS}
            width={width}
            startingIndex={GAMES.length}
          />
        </div>
      )}

      <StreakMilestoneModal
        milestone={milestone}
        onClose={onClose}
      />

      {isAdmin && (
        <Alert
          style={{ marginTop: '64px', maxWidth: '100vw' }}
          showIcon={false}
          title={
            <Space
              size="small"
              separator={<Divider orientation="vertical" />}
              wrap
            >
              <button
                type="button"
                onClick={() => setActiveGame('debug')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'inherit',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                }}
              >
                Debug
              </button>
              <button
                type="button"
                onClick={() => setActiveGame('demo')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'inherit',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                }}
              >
                Demo
              </button>
              <a
                href={getFirestoreConsoleUrl(`diario/${today}`)}
                target="_blank"
                rel="noreferrer"
              >
                Firestore
              </a>
            </Space>
          }
          type="info"
          banner
        />
      )}

      <HubDevTools />
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
        ({ KEY, ROUTE, HUB_ICON, NAME, COLOR, RELEASE_DATE, VERSION = 'stable', disabled }, index) => (
          <GameButton
            key={KEY}
            lsKey={KEY}
            width={width}
            href={ROUTE}
            Icon={HUB_ICON}
            name={NAME}
            color={COLOR}
            version={VERSION}
            releaseDate={RELEASE_DATE}
            disabled={
              disabled ||
              ['disabled', 'maintenance', 'soon'].includes(VERSION) ||
              hasBeenReleased(RELEASE_DATE)
            }
            index={startingIndex + index}
          />
        ),
      )}
      {Array.from({ length: (3 - (list.length % 3)) % 3 }).map((_, index) => (
        <div
          key={index}
          style={{ width }}
          className="hub-item-placeholder"
        />
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
  const { setActiveGame } = useDailyChallengeContext();
  const wasPlayed = checkWasPlayedToday(lsKey);

  const isNewRelease =
    daysSinceRelease(releaseDate) < 15 &&
    daysSinceRelease(releaseDate) > 0 &&
    !wasPlayed &&
    ['stable', 'beta'].includes(version);

  const handleClick = () => {
    if (!disabled) {
      playSFX('swap');
      logAnalyticsEvent(`daily_${lsKey}_hub_click`);
      setActiveGame(href);
    }
  };

  return (
    <motion.div className="played-wrapper">
      {wasPlayed && (
        <IconAvatar
          icon={<SpeechBubbleAcceptedIcon />}
          size="small"
          className="played-wrapper__played"
        />
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
          onClick={handleClick}
        >
          <div className="hub-link">
            <Icon style={{ width: width / 2 }} />
            <DualTranslate>{name}</DualTranslate>
          </div>
        </motion.button>
      </motion.div>
    </motion.div>
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
