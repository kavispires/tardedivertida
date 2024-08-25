import { Space, Typography } from 'antd';
import { TransparentButton } from 'components/buttons';
import { LanguageSwitch, Translate } from 'components/language';
import { DailyArtGameIcon } from 'icons/DailyArtGameIcon';
import { DailyDrawingGameIcon } from 'icons/DailyDrawingGameIcon';
import { DailyFindingGameIcon } from 'icons/DailyFindingGameIcon';
// import { DailyGroupingGameIcon } from 'icons/DailyGroupingGameIcon';
// import { DailyCrimeGameIcon } from 'icons/DailyCrimeGameIcon';
// import { DailyImagesGameIcon } from 'icons/DailyImagesGameIcon';
import { DailyMovieGameIcon } from 'icons/DailyMovieGameIcon';
import { DailyWarehouseGameIcon } from 'icons/DailyWarehouseGameIcon';
import { DailyWordGameIcon } from 'icons/DailyWordGameIcon';
import { Link } from 'react-router-dom';

import { DailyChrome } from '../components/DailyChrome';
import { DailyDiagramGameIcon } from 'icons/DailyDiagramGameIcon';

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
          <TransparentButton hoverType="sepia">
            <Link to="/diario/arte-ruim" className="hub-item">
              <DailyArtGameIcon style={{ width: 75 }} />
              <Translate pt="Arte Ruim" en="Questionable Art" />
            </Link>
          </TransparentButton>

          <TransparentButton hoverType="sepia">
            <Link to="/diario/aqui-o" className="hub-item">
              <DailyFindingGameIcon style={{ width: 75 }} />
              <Translate pt="Aqui Ó" en="Find This" />
            </Link>
          </TransparentButton>

          <TransparentButton hoverType="sepia" className="hub-item">
            <Link to="/diario/controle-de-estoque" className="hub-item">
              <DailyWarehouseGameIcon style={{ width: 75 }} />
              <Translate pt="Controle De Estoque" en="Warehouse" />
            </Link>
          </TransparentButton>

          <TransparentButton hoverType="sepia" className="hub-item">
            <Link to="/diario/filmaco" className="hub-item">
              <DailyMovieGameIcon style={{ width: 75 }} />
              <Translate pt="Filmaço" en="Movicon" />
            </Link>
          </TransparentButton>

          <TransparentButton hoverType="sepia" className="hub-item">
            <Link to="/diario/palavreado" className="hub-item">
              <DailyWordGameIcon style={{ width: 75 }} />
              <Translate pt="Palavreado" en="Rewording" />
            </Link>
          </TransparentButton>

          <TransparentButton hoverType="sepia" className="hub-item">
            <Link to="/diario/picaco" className="hub-item">
              <DailyDrawingGameIcon style={{ width: 75 }} />
              <Translate pt="Picaço!" en="Big Artist!" />
            </Link>
          </TransparentButton>

          <TransparentButton hoverType="sepia" disabled className="hub-item-disabled">
            <Link to="/diario/teoria-de-conjuntos" className="hub-item">
              <DailyDiagramGameIcon style={{ width: 75 }} />
              <Translate pt="Teoria de Conjuntos" en="Diagram Theory" />
            </Link>
          </TransparentButton>

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
