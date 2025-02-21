import clsx from 'clsx';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTimer } from 'react-timer-hook';
// Ant Design Resources
import { MutedOutlined, SoundFilled } from '@ant-design/icons';
import { Button, Switch, Typography } from 'antd';
// Hooks
import { useCardWidthByContainerRef } from 'hooks/useCardWidth';
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
import { DailyChrome } from '../components/DailyChrome';
import { SETTINGS as AQUI_O } from '../games/AquiO/utils/settings';
import { SETTINGS as ARTE_RUIM } from '../games/ArteRuim/utils/settings';
import { SETTINGS as PICACO } from './Picaco/utils/settings';
import { SETTINGS as CONTROLE_DE_ESTOQUE } from '../games/ControleDeEstoque/utils/settings';
import { SETTINGS as FILMACO } from '../games/Filmaco/utils/settings';
import { SETTINGS as PALAVREADO } from '../games/Palavreado/utils/settings';
import { SETTINGS as TEORIA_DE_CONJUNTOS } from '../games/TeoriaDeConjuntos/utils/settings';
import { SETTINGS as COMUNICACAO_ALIENIGENA } from '../games/ComunicacaoAlienigena/utils/settings';
import { SETTINGS as PORTAIS_MAGICOS } from '../games/PortaisMagicos/utils/settings';
import { SETTINGS as TA_NA_CARA } from './TaNaCara/utils/settings';
import { SETTINGS as QUARTETOS } from '../games/Quartetos/utils/settings';
import { checkWasPlayedToday } from '../utils';

type Entry = GameSettings & {
  disabled?: boolean;
};

const COMING_SOON_ENTRY: Entry = {
  KEY: '',
  ROUTE: '',
  EMOJI: '',
  COLOR: '',
  HUB_ICON: DailyContributionGame,
  HUB_NAME: { pt: '', en: '' },
  NAME: { pt: '', en: '' },
  TAGLINE: { pt: '', en: '' },
  disabled: true,
};

const GAMES: Entry[] = [
  ARTE_RUIM,
  AQUI_O,
  COMUNICACAO_ALIENIGENA,
  TEORIA_DE_CONJUNTOS,
  CONTROLE_DE_ESTOQUE,
  FILMACO,
  PALAVREADO,
];

const CONTRIBUTIONS: Entry[] = [
  PICACO,
  {
    ...TA_NA_CARA,
    disabled: true,
  },
  {
    ...COMING_SOON_ENTRY,
    HUB_ICON: DailyContributionGame,
    HUB_NAME: { pt: 'Responda', en: 'Answer' },
    COLOR: 'rgba(240, 240, 228, 0.85)',
    disabled: true,
  },
];

const DEMOS: Entry[] = [
  PORTAIS_MAGICOS,
  QUARTETOS,
  {
    ...COMING_SOON_ENTRY,
    HUB_ICON: DailyCrimeGameIcon,
    HUB_NAME: { pt: 'Crimes', en: 'Crimes' },
    COLOR: 'rgba(243, 232, 145, 0.85)',
    disabled: true,
  },
];

export function Hub() {
  const [width, ref] = useCardWidthByContainerRef(3, { maxWidth: 128, minWidth: 48, gap: 16 });

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

      <div className="hub">
        <Typography.Title level={5}>
          <Translate pt="Demos" en="Demos" />
        </Typography.Title>

        <HubList list={DEMOS} width={width} startingIndex={GAMES.length + CONTRIBUTIONS.length} />
      </div>
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
      {list.map(({ KEY, ROUTE, HUB_ICON, HUB_NAME, COLOR, disabled }, index) => (
        <GameButton
          key={KEY}
          lsKey={KEY}
          width={width}
          href={ROUTE}
          Icon={HUB_ICON}
          name={HUB_NAME}
          color={COLOR}
          disabled={disabled}
          index={startingIndex + index}
        />
      ))}
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
  index: number;
};

function GameButton({ lsKey, width, disabled, href, Icon, name, color, index }: GameButtonProps) {
  const wasPlayed = checkWasPlayedToday(lsKey);

  return (
    <div className="played-wrapper">
      {wasPlayed && (
        <IconAvatar icon={<SpeechBubbleAcceptedIcon />} size="small" className="played-wrapper__played" />
      )}
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
    </div>
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
          <Button key={name} onClick={() => dailySoundEffects.play(name)}>
            {name}
          </Button>
        ))}
      </div>
    );
  }
  return null;
}
