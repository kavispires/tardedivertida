import clsx from "clsx";
// Utils
import { getAnimationClass } from "utils/helpers";
// Icons
import { ShippingBoxIcon } from "icons/ShippingBoxIcon";
// Components
import { WarehouseGoodCard } from "components/cards/WarehouseGoodCard";
// Internal
import type { useControleDeEstoqueEngine } from "../utils/useControleDeEstoqueEngine";

type StockingBoardProps = {
  warehouse: ReturnType<typeof useControleDeEstoqueEngine>["warehouse"];
  onPlaceGood: ReturnType<typeof useControleDeEstoqueEngine>["onPlaceGood"];
  lastPlacedGoodId: ReturnType<
    typeof useControleDeEstoqueEngine
  >["lastPlacedGoodId"];
  width: number;
};

export function StockingBoard({
  warehouse,
  onPlaceGood,
  width,
  lastPlacedGoodId,
}: StockingBoardProps) {
  const size = { width, height: width };

  return (
    <div className="shelves-board">
      {warehouse.map((goodId, index) => {
        if (!goodId) {
          return (
            <div
              key={index}
              className={clsx("shelves-board__empty-shelf")}
              style={size}
            >
              <button
                type="button"
                className="shelves-board__empty-shelf-button"
                onClick={() => onPlaceGood(index)}
              >
                ?
              </button>
            </div>
          );
        }

        if (goodId !== lastPlacedGoodId) {
          return (
            <div
              key={index}
              className={clsx(
                "shelves-board__shelf",
                getAnimationClass("flipInY"),
              )}
              style={size}
            >
              <ShippingBoxIcon width={width - 12} />
            </div>
          );
        }

        return (
          <div
            key={index}
            className={clsx("shelves-board__shelf")}
            style={size}
          >
            <WarehouseGoodCard
              id={goodId}
              padding={1}
              width={width - 12}
              className={getAnimationClass("bounce")}
            />
          </div>
        );
      })}
    </div>
  );
}
