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
import { DailyAlienGameIcon } from 'icons/DailyAlienGameIcon';
import { DailyArtGameIcon } from 'icons/DailyArtGameIcon';
import { DailyCrimeGameIcon } from 'icons/DailyCrimeGameIcon';
import { DailyDiagramGameIcon } from 'icons/DailyDiagramGameIcon';
import { DailyDrawingGameIcon } from 'icons/DailyDrawingGameIcon';
import { DailyFindingGameIcon } from 'icons/DailyFindingGameIcon';
import { DailyGroupingGameIcon } from 'icons/DailyGroupingGameIcon';
import { DailyImagesGameIcon } from 'icons/DailyImagesGameIcon';
import { DailyMovieGameIcon } from 'icons/DailyMovieGameIcon';
import { DailyWarehouseGameIcon } from 'icons/DailyWarehouseGameIcon';
import { DailyWordGameIcon } from 'icons/DailyWordGameIcon';
import { SpeechBubbleAcceptedIcon } from 'icons/SpeechBubbleAcceptedIcon';
// Components
import { IconAvatar } from 'components/avatars';
import { DualTranslate, LanguageSwitch, Translate } from 'components/language';
// Internal
import { dailySoundEffects, playSFX, SFXAllNames } from '../utils/soundEffects';
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
import { checkWasPlayedToday } from '../utils';

type Entry = {
  lsKey: string;
  href: string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  name: DualLanguageValue;
  color: string;
  disabled?: boolean;
};

const GAMES: Entry[] = [
  {
    lsKey: ARTE_RUIM.KEY,
    href: 'arte-ruim',
    Icon: DailyArtGameIcon,
    name: { pt: 'Arte Ruim', en: 'Art?' },
    color: 'rgba(158, 182, 244, 0.85)',
  },
  {
    lsKey: AQUI_O.KEY,
    href: 'aqui-o',
    Icon: DailyFindingGameIcon,
    name: { pt: 'Aqui Ó', en: 'Find This' },
    color: 'rgba(227, 167, 111, 0.85)',
  },
  {
    lsKey: COMUNICACAO_ALIENIGENA.KEY,
    href: 'comunicacao-alienigena',
    Icon: DailyAlienGameIcon,
    name: { pt: 'Alienígena', en: 'Alienish' },
    color: 'rgba(105, 218, 207, 0.85)',
  },
  {
    lsKey: TEORIA_DE_CONJUNTOS.KEY,
    href: 'teoria-de-conjuntos',
    Icon: DailyDiagramGameIcon,
    name: { pt: 'Conjuntos', en: 'Diagram' },
    color: 'rgba(172, 128, 221, 0.85)',
  },
  {
    lsKey: CONTROLE_DE_ESTOQUE.KEY,
    href: 'controle-de-estoque',
    Icon: DailyWarehouseGameIcon,
    name: { pt: 'Estoque', en: 'Warehouse' },
    color: 'rgba(255, 199, 59, 0.85)',
  },
  {
    lsKey: FILMACO.KEY,
    href: 'filmaco',
    Icon: DailyMovieGameIcon,
    name: { pt: 'Filmaço', en: 'Movicon' },
    color: 'rgba(85, 161, 255, 0.85)',
  },
  {
    lsKey: PALAVREADO.KEY,
    href: 'palavreado',
    Icon: DailyWordGameIcon,
    name: { pt: 'Palavreado', en: 'Rewording' },
    color: 'rgba(239, 83, 80, 0.85)',
  },
];

const CONTRIBUTIONS: Entry[] = [
  {
    lsKey: PICACO.KEY,
    href: 'picaco',
    Icon: DailyDrawingGameIcon,
    name: { pt: 'Picaço!', en: 'Artist!' },
    color: 'rgba(237, 238, 240, 0.85)',
  },
];

const DEMOS: Entry[] = [
  {
    lsKey: PORTAIS_MAGICOS.KEY,
    href: 'portais-magicos',
    Icon: DailyImagesGameIcon,
    name: { pt: 'Portais', en: 'Doors' },
    color: 'rgba(255, 171, 145, 0.85)',
  },
  {
    lsKey: '',
    href: '',
    Icon: DailyCrimeGameIcon,
    name: { pt: 'Crimes', en: 'Crimes' },
    color: 'rgba(243, 232, 145, 0.85)',
    disabled: true,
  },
  {
    lsKey: '',
    href: '',
    Icon: DailyGroupingGameIcon,
    name: { pt: 'Quartetos', en: 'Connect' },
    color: 'rgba(243, 145, 189, 0.85)',
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
  list: Entry[];
  width: number;
  startingIndex: number;
};

function HubList({ list, width, startingIndex }: HubListProps) {
  return (
    <div className="hub-list">
      {list.map(({ lsKey, href, Icon, name, color, disabled }, index) => (
        <GameButton
          key={lsKey}
          lsKey={lsKey}
          width={width}
          href={href}
          Icon={Icon}
          name={name}
          color={color}
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
