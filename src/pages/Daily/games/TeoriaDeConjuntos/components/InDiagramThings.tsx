import { TThing } from '../utils/types';
import { Thing } from './Thing';

type InDiagramThingsProps = {
  things: TThing[];
  width: number;
};

export function InDiagramThings({ things, width }: InDiagramThingsProps) {
  return (
    <>
      {things.map((thing, index, arr) => {
        const isLatestThing = index === arr.length - 1;

        return (
          <Thing
            key={thing.id}
            itemId={thing.id}
            name={thing.name}
            width={width * (isLatestThing ? 2 : 1)}
            className="thing-enlarged"
            minimize={arr.length > 3 && !isLatestThing}
          />
        );
      })}
    </>
  );
}
