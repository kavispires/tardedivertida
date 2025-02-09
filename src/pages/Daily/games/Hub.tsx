import clsx from 'clsx';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
// Ant Design Resources
import { MutedOutlined, SoundFilled } from '@ant-design/icons';
import { Switch, Typography } from 'antd';
// Hooks
import { useCardWidthByContainerRef } from 'hooks/useCardWidth';
import { useGlobalLocalStorage } from 'hooks/useGlobalLocalStorage';
// Utils
import { getAnimation } from 'utils/animations';
// Icons
import { DailyAlienGameIcon } from 'icons/DailyAlienGameIcon';
import { DailyArtGameIcon } from 'icons/DailyArtGameIcon';
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
import { DailyChrome } from '../components/DailyChrome';
import { SETTINGS as AQUI_O } from '../games/AquiO/utils/settings';
import { SETTINGS as ARTE_RUIM } from '../games/ArteRuim/utils/settings';
import { SETTINGS as PICACO } from './Picaco/utils/settings';
import { SETTINGS as CONTROLE_DE_ESTOQUE } from '../games/ControleDeEstoque/utils/settings';
import { SETTINGS as FILMACO } from '../games/Filmaco/utils/settings';
import { SETTINGS as PALAVREADO } from '../games/Palavreado/utils/settings';
import { SETTINGS as TEORIA_DE_CONJUNTOS } from '../games/TeoriaDeConjuntos/utils/settings';
import { SETTINGS as COMUNICACAO_ALIENIGENA } from '../games/ComunicacaoAlienigena/utils/settings';
import { checkWasPlayedToday } from '../utils';
// import { DailyCrimeGameIcon } from 'icons/DailyCrimeGameIcon';

export function Hub() {
  const [width, ref] = useCardWidthByContainerRef(3, { maxWidth: 128, minWidth: 48, gap: 16 });

  return (
    <DailyChrome>
      <div className="menu menu--hub">
        <LanguageSwitch />
        <SoundFX />
      </div>
      <div className="hub" ref={ref}>
        <Typography.Title level={5}>
          <Translate pt="Jogue" en="Play" />
        </Typography.Title>

        <div className="hub-list">
          <GameButton
            lsKey={ARTE_RUIM.KEY}
            width={width}
            href="arte-ruim"
            Icon={DailyArtGameIcon}
            name={{ pt: 'Arte Ruim', en: 'Art?' }}
            color="rgba(158, 182, 244, 0.85)"
            index={0}
          />

          <GameButton
            lsKey={AQUI_O.KEY}
            width={width}
            href="aqui-o"
            Icon={DailyFindingGameIcon}
            name={{ pt: 'Aqui Ó', en: 'Find This' }}
            color="rgba(227, 167, 111, 0.85)"
            index={1}
          />

          <GameButton
            lsKey={COMUNICACAO_ALIENIGENA.KEY}
            width={width}
            href="comunicacao-alienigena"
            Icon={DailyAlienGameIcon}
            name={{ pt: 'Alienígena', en: 'Alienish' }}
            color="rgba(91, 220, 207, 0.85)"
            index={2}
          />

          <GameButton
            lsKey={TEORIA_DE_CONJUNTOS.KEY}
            width={width}
            href="teoria-de-conjuntos"
            Icon={DailyDiagramGameIcon}
            name={{ pt: 'Conjuntos', en: 'Diagram' }}
            color="rgba(172, 128, 221, 0.85)"
            index={3}
          />

          <GameButton
            lsKey={CONTROLE_DE_ESTOQUE.KEY}
            width={width}
            href="controle-de-estoque"
            Icon={DailyWarehouseGameIcon}
            name={{ pt: 'Estoque', en: 'Warehouse' }}
            color="rgba(255, 199, 59, 0.85)"
            index={4}
          />

          <GameButton
            lsKey={FILMACO.KEY}
            width={width}
            href="filmaco"
            Icon={DailyMovieGameIcon}
            name={{ pt: 'Filmaço', en: 'Movicon' }}
            color="rgba(85, 161, 255, 0.85)"
            index={5}
          />

          <GameButton
            lsKey={PALAVREADO.KEY}
            width={width}
            href="palavreado"
            Icon={DailyWordGameIcon}
            name={{ pt: 'Palavreado', en: 'Rewording' }}
            color="rgba(239, 83, 80, 0.85)"
            index={6}
          />

          <GameButton
            lsKey=""
            width={width}
            disabled
            href=""
            Icon={DailyGroupingGameIcon}
            name={{ pt: 'Quartetos', en: 'Connect Four' }}
            color="rgba(243, 145, 189, 0.85)"
            index={7}
          />

          <GameButton
            lsKey=""
            width={width}
            disabled
            href=""
            Icon={DailyImagesGameIcon}
            name={{ pt: 'Portais', en: 'Doors' }}
            color="rgba(255, 171, 145, 0.85)"
            index={8}
          />

          {/* <TransparentButton hoverType="sepia" className="hub-item" disabled className="hub-item-disabled">
            <Link to="/diario" className="hub-link">
              <DailyCrimeGameIcon style={{ width: 75 }} />
              <Translate pt="Crime Hediondo" en="Horrible Crimes" />
            </Link>
          </TransparentButton> */}
        </div>
      </div>
      <div className="hub">
        <Typography.Title level={5}>
          <Translate pt="Contribua" en="Contribute" />
        </Typography.Title>

        <div className="hub-list">
          <GameButton
            lsKey={PICACO.KEY}
            width={width}
            href="picaco"
            Icon={DailyDrawingGameIcon}
            name={{ pt: 'Picaço!', en: 'Artist!' }}
            color="rgba(237, 238, 240, 0.85)"
            index={9}
          />
        </div>
      </div>
    </DailyChrome>
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
      >
        <Link to={`/diario/${href}"`} className="hub-link">
          <Icon style={{ width: width / 2 }} />
          <DualTranslate>{name}</DualTranslate>
        </Link>
      </motion.button>
    </div>
  );
}

function SoundFX() {
  const [_, setVolume] = useGlobalLocalStorage('volume');

  const onSwitchClick = (checked: boolean) => {
    setVolume(checked ? 0.5 : 0);
  };

  return (
    <Switch
      checkedChildren={<SoundFilled />}
      unCheckedChildren={<MutedOutlined />}
      // TODO: Implement sound effects
      checked={false}
      onClick={onSwitchClick}
      disabled
    />
  );
}
