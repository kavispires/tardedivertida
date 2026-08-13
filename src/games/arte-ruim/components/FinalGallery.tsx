// Types
import type { GamePlayers } from 'types/game';
// Components
import { CanvasSVG } from '@components/canvas/CanvasSVG';
import { Translate } from '@components/language/Translate';
import { TranslateTemplate } from '@components/language/TranslateTemplate';
import { TitledContainer } from '@components/layout/TitledContainer';
// Internal
import type { ArteRuimDrawing } from '../utils/types';
import { DrawingGrade } from './DrawingGrade';

type FinalGalleryProps = {
  drawings: ArteRuimDrawing[];
  players: GamePlayers;
};

export function FinalGallery({ drawings, players }: FinalGalleryProps) {
  return (
    <TitledContainer
      title={
        <Translate
          pt="Galeria"
          en="Galeria"
        />
      }
    >
      <ul className="a-game-over__gallery">
        {drawings.map((entry: ArteRuimDrawing) => {
          const successRate = entry.successRate ?? 0;

          return (
            <li
              className="a-game-over__gallery-item"
              key={entry.drawing}
              style={{ width: '200px' }}
            >
              <CanvasSVG
                drawing={entry.drawing}
                width={200}
                className="a-game-over__gallery-canvas"
              />
              <span className="a-game-over__credits">
                <TranslateTemplate
                  pt="{text} por {name}"
                  en="{text} by {name}"
                  values={{ text: entry.text, name: players[entry.playerId].name }}
                />
              </span>
              <DrawingGrade value={successRate > 1 ? successRate / 100 : successRate} />
            </li>
          );
        })}
      </ul>
    </TitledContainer>
  );
}
