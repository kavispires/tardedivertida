import clsx from "clsx";
import { orderBy } from "lodash";
import { useMemo } from "react";
// Ant Design Resources
import { Space } from "antd";
// Components
import { Instruction } from "components/text";
// Internal
import type { Leaves, LeafId, LeafEvent } from "../utils/types";
import { Leaf } from "./Leaf";
// And Design Resources

type DetachedLeavesProps = {
  leaves: Leaves;
  usedLeavesIds: LeafId[];
  rotations: NumberDictionary;
  onLeafRotate: LeafEvent;
  activeLeafId?: LeafId | null;
  onLeafGrab?: GenericFunction;
};

export function DetachedLeaves({
  leaves,
  onLeafRotate,
  rotations,
  activeLeafId,
  onLeafGrab,
  usedLeavesIds,
}: DetachedLeavesProps) {
  const availableLeaves = useMemo(
    () =>
      orderBy(Object.values(leaves), "id").filter(
        (leaf) => !usedLeavesIds.includes(leaf.id),
      ),
    [leaves, usedLeavesIds],
  );

  return (
    <Instruction contained>
      <Space className="space-container" align="center" wrap>
        {availableLeaves.map((leaf) => {
          return (
            <div className="y-leaf-loose" key={leaf.id}>
              <Leaf
                key={leaf.id}
                leaf={leaf}
                onLeafGrab={onLeafGrab}
                onLeafRotate={onLeafRotate}
                rotation={rotations?.[leaf.id]}
                className={clsx(activeLeafId === leaf.id && "y-leaf--active")}
              />
            </div>
          );
        })}
      </Space>
    </Instruction>
  );
}
