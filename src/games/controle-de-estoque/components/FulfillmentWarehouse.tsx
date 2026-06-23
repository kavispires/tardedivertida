import { DndContext, type DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { useCallback, useMemo } from 'react';
// Ant Design Resources
import { Flex } from 'antd';
// Icons
import { ShippingBoxIcon } from '@icons/ShippingBoxIcon';
// Components
import { WarehouseGoodCard } from '@components/cards/WarehouseGoodCard';
import { DraggableItem, DroppableArea } from '@components/drag-and-drop/DragAndDrop';
import { Translate } from '@components/language/Translate';
import { ZoomPanPinchContainer } from '@components/layout/ZoomPanPinchContainer';
// Internal
import type { Good, WarehouseSlot } from '../utils/types';
import { useGoodSize } from '../utils/hooks';

type FulfillmentWarehouseProps = {
  /**
   * Dictionary of all goods in the game
   */
  goodsDict: Dictionary<Good>;
  /**
   * The warehouse slots array
   */
  warehouse: WarehouseSlot[];
  /**
   * Array of goodIds that need to be fulfilled
   */
  orders: UID[];
  /**
   * Dictionary mapping goodId -> slotId (-1 is out-of-stock, not present is skipped)
   */
  fulfillmentsDict: Dictionary<number>;
  /**
   * Setter for fulfillmentsDict
   */
  setFulfillmentsDict: React.Dispatch<React.SetStateAction<Dictionary<number>>>;
};

export function FulfillmentWarehouse({
  goodsDict,
  warehouse,
  orders,
  fulfillmentsDict,
  setFulfillmentsDict,
}: FulfillmentWarehouseProps) {
  const { goodSize, goodWidth, warehouseWidth } = useGoodSize();

  // Sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3, // 3px drag distance before activation
      },
    }),
  );

  // Derive state helpers
  const { slotToGoodMap, unfulfilledOrders, outOfStockGoods } = useMemo(() => {
    const slotMap: Dictionary<UID> = {};
    const outOfStock: UID[] = [];

    // Build slot map and out-of-stock list
    Object.entries(fulfillmentsDict).forEach(([goodId, slotId]) => {
      if (slotId === -1) {
        outOfStock.push(goodId);
      } else if (slotId !== undefined && slotId >= 0) {
        slotMap[slotId] = goodId;
      }
    });

    // Find unfulfilled orders (not in fulfillmentsDict)
    const unfulfilled = orders.filter((goodId) => !(goodId in fulfillmentsDict));

    return {
      slotToGoodMap: slotMap,
      unfulfilledOrders: unfulfilled,
      outOfStockGoods: outOfStock,
    };
  }, [fulfillmentsDict, orders]);

  /**
   * Handle drag end event
   */
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (!over) {
        // Dropped outside any droppable area - return to unfulfilled
        const activeId = String(active.id);
        if (activeId.startsWith('fulfilled-') || activeId.startsWith('out-of-stock-')) {
          const goodId = activeId.replace('fulfilled-', '').replace('out-of-stock-', '');
          setFulfillmentsDict((prev) => {
            const next = { ...prev };
            delete next[goodId];
            return next;
          });
        }
        return;
      }

      const activeId = String(active.id);
      const overId = String(over.id);

      // Extract goodId from active
      let goodId: string;
      if (activeId.startsWith('order-')) {
        goodId = activeId.replace('order-', '');
      } else if (activeId.startsWith('fulfilled-')) {
        goodId = activeId.replace('fulfilled-', '');
      } else if (activeId.startsWith('out-of-stock-')) {
        goodId = activeId.replace('out-of-stock-', '');
      } else {
        return;
      }

      // Handle drop on out-of-stock area
      if (overId === 'out-of-stock') {
        setFulfillmentsDict((prev) => ({ ...prev, [goodId]: -1 }));
        return;
      }

      // Handle drop on warehouse slot
      if (overId.startsWith('slot-')) {
        const slotIndex = Number.parseInt(overId.replace('slot-', ''), 10);

        setFulfillmentsDict((prev) => {
          const next = { ...prev };

          // Remove any other good that had this slot
          Object.entries(next).forEach(([otherGoodId, otherSlotId]) => {
            if (otherSlotId === slotIndex && otherGoodId !== goodId) {
              delete next[otherGoodId];
            }
          });

          // Assign this good to the slot
          next[goodId] = slotIndex;

          return next;
        });
      }
    },
    [setFulfillmentsDict],
  );

  return (
    <DndContext
      sensors={sensors}
      onDragEnd={handleDragEnd}
    >
      <div className="fulfillment-container">
        {/* Left: Warehouse Grid */}
        <div className="fulfillment-container__warehouse">
          <ZoomPanPinchContainer
            maxWidth={warehouseWidth}
            transformWrapperProps={{
              minScale: 0.5,
              maxScale: 2,
              wheel: {
                disabled: true,
              },
              panning: {
                disabled: true,
              },
              doubleClick: {
                disabled: true,
              },
            }}
            persistentZoomKey="controle-de-estoque"
          >
            <div className="warehouse">
              {warehouse.map((slot, index) => {
                // Slot available to be fulfilled (orders can be drag here or from here)
                if (slot.goodId && slot.status === 'idle') {
                  const goodInSlot = slotToGoodMap[index];

                  if (goodInSlot) {
                    const good = goodsDict[goodInSlot];
                    return (
                      <DroppableArea
                        key={index}
                        id={`slot-${index}`}
                        className="warehouse__shelf warehouse__shelf-fulfilled"
                        style={goodSize}
                        options={{
                          highlightColor: 'gold',
                          hoverScale: 1.05,
                        }}
                      >
                        <DraggableItem
                          id={`fulfilled-${goodInSlot}`}
                          className="warehouse__draggable-good"
                          wrapperStyle={{ width: goodSize.width, height: goodSize.height }}
                          style={{ width: goodSize.width, height: goodSize.height }}
                          options={{
                            dragScale: 1.1,
                            dragOpacity: 0.7,
                          }}
                        >
                          <WarehouseGoodCard
                            goodId={goodInSlot}
                            width={goodWidth}
                            className={`warehouse__good--${good?.orientation ?? 0}`}
                          />
                        </DraggableItem>
                      </DroppableArea>
                    );
                  }

                  return (
                    <DroppableArea
                      key={index}
                      id={`slot-${index}`}
                      className="warehouse__empty-shelf warehouse__empty-available-shelf"
                      style={goodSize}
                      options={{
                        highlightColor: 'gold',
                        hoverScale: 1.1,
                      }}
                    >
                      <ShippingBoxIcon width={goodWidth} />
                    </DroppableArea>
                  );
                }

                // Fixed goods on unavailable slots because the goods were previously fulfilled (not draggable, not droppable)
                if (slot.goodId && slot.status !== 'idle') {
                  const good = goodsDict[slot.goodId];

                  return (
                    <div
                      key={index}
                      className="warehouse__shelf warehouse__shelf-fixed"
                      style={goodSize}
                    >
                      <WarehouseGoodCard
                        goodId={slot.goodId}
                        width={goodWidth}
                        className={`warehouse__good--${good?.orientation ?? 0}`}
                      />
                    </div>
                  );
                }

                // Empty slot that is also unavailable because no good was ever placed there
                return (
                  <div
                    key={index}
                    className="warehouse__empty-shelf"
                    style={goodSize}
                  >
                    .
                  </div>
                );
              })}
            </div>
          </ZoomPanPinchContainer>
        </div>

        {/* Right: Orders Panel */}
        <div
          className="fulfillment-container__orders"
          style={{ width: goodSize.width * 3 + 48 }}
        >
          {/* Out of Stock Area */}
          <div className="fulfillment-orders__section">
            <h4 className="fulfillment-orders__title">
              <Translate
                pt="Fora de Estoque"
                en="Out of Stock"
              />
            </h4>
            <DroppableArea
              id="out-of-stock"
              className="fulfillment-orders__out-of-stock"
              options={{
                highlightColor: '#ff6b6b',
                hoverScale: 1.02,
              }}
            >
              {outOfStockGoods.length === 0 ? (
                <div
                  className="fulfillment-orders__empty"
                  style={{ minHeight: goodSize.height }}
                >
                  <Translate
                    pt="Arraste aqui produtos esgotados"
                    en="Drag out-of-stock goods here"
                  />
                </div>
              ) : (
                <Flex
                  wrap
                  gap={8}
                  style={{ minHeight: goodSize.height }}
                >
                  {outOfStockGoods.map((goodId) => {
                    const smallSize = Math.round(goodSize.width * 0.75);
                    return (
                      <DraggableItem
                        key={goodId}
                        id={`out-of-stock-${goodId}`}
                        className="fulfillment-orders__draggable-small"
                        wrapperStyle={{ width: smallSize, height: smallSize }}
                        style={{ width: smallSize, height: smallSize }}
                        options={{
                          dragScale: 1.1,
                          dragOpacity: 0.7,
                        }}
                      >
                        <WarehouseGoodCard
                          goodId={goodId}
                          width={smallSize - 12}
                        />
                      </DraggableItem>
                    );
                  })}
                </Flex>
              )}
            </DroppableArea>
          </div>

          {/* Unfulfilled Orders */}
          <div className="fulfillment-orders__section">
            <h4 className="fulfillment-orders__title">
              <Translate
                pt="Pedidos"
                en="Orders"
              />
              <span className="fulfillment-orders__count">({unfulfilledOrders.length})</span>
            </h4>
            <Flex
              wrap
              gap={8}
              className="fulfillment-orders__list"
            >
              {unfulfilledOrders.map((goodId) => (
                <DraggableItem
                  key={goodId}
                  id={`order-${goodId}`}
                  className="fulfillment-orders__draggable"
                  wrapperStyle={{ width: goodSize.width, height: goodSize.height }}
                  style={{ width: goodSize.width, height: goodSize.height }}
                  options={{
                    dragScale: 1.1,
                    dragOpacity: 0.7,
                  }}
                >
                  <WarehouseGoodCard
                    goodId={goodId}
                    width={goodWidth}
                  />
                </DraggableItem>
              ))}
            </Flex>
          </div>
        </div>
      </div>
    </DndContext>
  );
}
