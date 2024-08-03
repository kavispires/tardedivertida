import { Typography } from 'antd';
import { WarehouseGoodCard } from 'components/cards/WarehouseGoodCard';
import { Translate } from 'components/language';
import { Instruction } from 'components/text';
import { Region, TextRegion } from 'pages/Daily/components/Region';
import { getAnimationClass } from 'utils/helpers';

import { useControleDeEstoqueEngine } from '../utils/useControleDeEstoqueEngine';
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

      <TextRegion>
        <Instruction contained noMargin>
          <Translate
            pt="Coloque o produto em uma prateleira vazia:"
            en="Place the product on an empty shelf:"
          />
        </Instruction>
      </TextRegion>

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

      <TextRegion>
        <Instruction contained noMargin>
          <Typography.Text>
            <Translate
              pt="
                Um bom funcionário sempre sabe onde está cada produto. Lembre-se de usar uma certa lógica para memorizar a posição de cada produto."
              en="A good employee always knows where each product is. Remember to use a certain logic to memorize the position of each product."
            />
          </Typography.Text>
        </Instruction>
      </TextRegion>
    </>
  );
}
