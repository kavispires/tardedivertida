import { Space, Typography } from 'antd';
import clsx from 'clsx';
import { TransparentButton } from 'components/buttons';
import { LanguageSwitch, Translate } from 'components/language';
import { DailyArtGameIcon } from 'icons/DailyArtGameIcon';
import { DailyDiagramGameIcon } from 'icons/DailyDiagramGameIcon';
import { DailyDrawingGameIcon } from 'icons/DailyDrawingGameIcon';
import { DailyFindingGameIcon } from 'icons/DailyFindingGameIcon';
// import { DailyGroupingGameIcon } from 'icons/DailyGroupingGameIcon';
// import { DailyCrimeGameIcon } from 'icons/DailyCrimeGameIcon';
// import { DailyImagesGameIcon } from 'icons/DailyImagesGameIcon';
import { DailyMovieGameIcon } from 'icons/DailyMovieGameIcon';
import { DailyWarehouseGameIcon } from 'icons/DailyWarehouseGameIcon';
import { DailyWordGameIcon } from 'icons/DailyWordGameIcon';
import { Link } from 'react-router-dom';
import { getAnimationClass } from 'utils/helpers';

import { DailyChrome } from '../components/DailyChrome';
import { PlayedWrapper } from '../components/PlayedWrapper';
import { SETTINGS as AQUI_O } from '../games/AquiO/utils/settings';
import { SETTINGS as ARTE_RUIM } from '../games/ArteRuim/utils/settings';
import { SETTINGS as ARTISTA } from '../games/Artista/utils/settings';
import { SETTINGS as CONTROLE_DE_ESTOQUE } from '../games/ControleDeEstoque/utils/settings';
import { SETTINGS as FILMACO } from '../games/Filmaco/utils/settings';
import { SETTINGS as PALAVREADO } from '../games/Palavreado/utils/settings';
import { SETTINGS as TEORIA_DE_CONJUNTOS } from '../games/TeoriaDeConjuntos/utils/settings';
import { checkWasPlayedToday } from '../utils';

export function Hub() {
  return (
    <DailyChrome>
      <div className="hub">
        <Typography.Title level={5}>
          <Translate pt="Escolha um jogo" en="Choose a game" />
        </Typography.Title>
        <Space className="space-container">
          <LanguageSwitch />
        </Space>

        <div className="hub-list">
          <PlayedWrapper lsKey={ARTE_RUIM.KEY}>
            <TransparentButton hoverType="sepia">
              <Link to="/diario/arte-ruim" className="hub-item">
                <DailyArtGameIcon style={{ width: 75 }} />
                <Translate pt="Arte Ruim" en="Questionable Art" />
              </Link>
            </TransparentButton>
          </PlayedWrapper>

          <PlayedWrapper lsKey={AQUI_O.KEY}>
            <TransparentButton hoverType="sepia">
              <Link to="/diario/aqui-o" className="hub-item">
                <DailyFindingGameIcon style={{ width: 75 }} />
                <Translate pt="Aqui Ó" en="Find This" />
              </Link>
            </TransparentButton>
          </PlayedWrapper>

          <PlayedWrapper lsKey={CONTROLE_DE_ESTOQUE.KEY}>
            <TransparentButton hoverType="sepia">
              <Link to="/diario/controle-de-estoque" className="hub-item">
                <DailyWarehouseGameIcon style={{ width: 75 }} />
                <Translate pt="Controle De Estoque" en="Warehouse" />
              </Link>
            </TransparentButton>
          </PlayedWrapper>

          <PlayedWrapper lsKey={FILMACO.KEY}>
            <TransparentButton hoverType="sepia">
              <Link to="/diario/filmaco" className="hub-item">
                <DailyMovieGameIcon style={{ width: 75 }} />
                <Translate pt="Filmaço" en="Movicon" />
              </Link>
            </TransparentButton>
          </PlayedWrapper>

          <PlayedWrapper lsKey={PALAVREADO.KEY}>
            <TransparentButton hoverType="sepia">
              <Link to="/diario/palavreado" className="hub-item">
                <DailyWordGameIcon style={{ width: 75 }} />
                <Translate pt="Palavreado" en="Rewording" />
              </Link>
            </TransparentButton>
          </PlayedWrapper>

          <PlayedWrapper lsKey={ARTISTA.LOCAL_TODAY_KEY}>
            <TransparentButton hoverType="sepia">
              <Link to="/diario/picaco" className="hub-item">
                <DailyDrawingGameIcon style={{ width: 75 }} />
                <Translate pt="Picaço!" en="Big Artist!" />
              </Link>
            </TransparentButton>
          </PlayedWrapper>

          <PlayedWrapper lsKey={TEORIA_DE_CONJUNTOS.KEY}>
            <TransparentButton
              hoverType="sepia"
              className={clsx(
                !checkWasPlayedToday(TEORIA_DE_CONJUNTOS.KEY) && getAnimationClass('tada', { repeat: 3 })
              )}
            >
              <Link to="/diario/teoria-de-conjuntos" className="hub-item">
                <DailyDiagramGameIcon style={{ width: 75 }} />
                <Translate pt="Teoria de Conjuntos" en="Diagram Theory" />
              </Link>
            </TransparentButton>
          </PlayedWrapper>

          {/* <TransparentButton hoverType="sepia" disabled className="hub-item-disabled">
            <Link to="/diario" className="hub-item">
              <DailyGroupingGameIcon style={{ width: 75 }} />
              <Translate pt="Quarteto" en="Connect Four" />
            </Link>
          </TransparentButton> */}

          {/* <TransparentButton hoverType="sepia" disabled className="hub-item-disabled">
            <Link to="/diario" className="hub-item">
              <DailyCrimeGameIcon style={{ width: 75 }} />
              <Translate pt="Crime Hediondo" en="Horrible Crimes" />
            </Link>
          </TransparentButton> */}

          {/* <TransparentButton hoverType="sepia" disabled className="hub-item-disabled">
            <Link to="/diario" className="hub-item">
              <DailyImagesGameIcon style={{ width: 75 }} />
              <Translate pt="Imagine" en="Imagine" />
            </Link>
          </TransparentButton> */}
        </div>
      </div>
    </DailyChrome>
  );
}
