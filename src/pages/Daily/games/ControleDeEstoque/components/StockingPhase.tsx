import { Region, RegionHint, RegionText } from 'pages/Daily/components/Region';
// Utils
import { getAnimationClass } from 'utils/helpers';
// Components
import { WarehouseGoodCard } from 'components/cards/WarehouseGoodCard';
import { Translate } from 'components/language';
// Internal
import type { useControleDeEstoqueEngine } from '../utils/useControleDeEstoqueEngine';
import { StockingBoard } from './StockingBoard';

type StockingPhaseProps = {
  warehouse: ReturnType<typeof useControleDeEstoqueEngine>['warehouse'];
  onPlaceGood: ReturnType<typeof useControleDeEstoqueEngine>['onPlaceGood'];
  currentGood: ReturnType<typeof useControleDeEstoqueEngine>['currentGood'];
  lastPlacedGoodId: ReturnType<typeof useControleDeEstoqueEngine>['lastPlacedGoodId'];
  shelfWidth: number;
};

export function StockingPhase({
  warehouse,
  currentGood,
  lastPlacedGoodId,
  onPlaceGood,
  shelfWidth,
}: StockingPhaseProps) {
  return (
    <>
      <Region>
        <StockingBoard
          warehouse={warehouse}
          onPlaceGood={onPlaceGood}
          width={shelfWidth}
          lastPlacedGoodId={lastPlacedGoodId}
        />
      </Region>

      <RegionText>
        <Translate
          pt="Coloque o produto em uma prateleira vazia:"
          en="Place the product on an empty shelf:"
        />
      </RegionText>

      <Region>
        {currentGood && (
          <WarehouseGoodCard
            id={currentGood}
            width={shelfWidth}
            key={currentGood}
            className={getAnimationClass('lightSpeedInLeft')}
          />
        )}
      </Region>

      <RegionHint>
        <Translate
          pt={
            <>
              Um bom funcionário sempre sabe onde está cada produto.
              <br />
              Lembre-se de usar uma certa lógica para memorizar a posição de cada produto.
            </>
          }
          en={
            <>
              A good employee always knows where each product is.
              <br />
              Remember to use a certain logic to memorize the position of each product.
            </>
          }
        />
      </RegionHint>
    </>
  );
}
