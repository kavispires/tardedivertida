import { Typography } from 'antd';
import { TransparentButton } from 'components/buttons';
import { Translate } from 'components/language';
import { DailyDrawingGameIcon } from 'icons/DailyDrawingGameIcon';
import { DailyFindingGameIcon } from 'icons/DailyFindingGameIcon';
import { DailyGroupingGameIcon } from 'icons/DailyGroupingGameIcon';
import { DailyWordGameIcon } from 'icons/DailyWordGameIcon';
import { Link } from 'react-router-dom';

import { DailyChrome } from './Common/DailyChrome';

export function Hub() {
  return (
    <DailyChrome>
      <div className="hub">
        <Typography.Title level={5}>
          <Translate pt="Escolha um jogo" en="Choose a game" />
        </Typography.Title>

        <div className="hub-list">
          <TransparentButton hoverType="sepia">
            <Link to="/diario" className="hub-item">
              <DailyDrawingGameIcon style={{ width: 75 }} />
              <Translate pt="Arte Ruim" en="Questionable Art" />
            </Link>
          </TransparentButton>

          <TransparentButton hoverType="sepia">
            <Link to="/diario/aqui-o" className="hub-item">
              <DailyFindingGameIcon style={{ width: 75 }} />
              <Translate pt="Aqui Ó" en="Find This" />
            </Link>
          </TransparentButton>

          <TransparentButton hoverType="sepia" disabled className="hub-item-disabled">
            <Link to="/diario/quarteto" className="hub-item">
              <DailyGroupingGameIcon style={{ width: 75 }} />
              <Translate pt="Quarteto" en="Connect Four" />
            </Link>
          </TransparentButton>

          <TransparentButton hoverType="sepia" disabled className="hub-item-disabled">
            <Link to="/diario/palavreado" className="hub-item">
              <DailyWordGameIcon style={{ width: 75 }} />
              <Translate pt="Palavreado" en="Word Game" />
            </Link>
          </TransparentButton>
        </div>
      </div>
    </DailyChrome>
  );
}
