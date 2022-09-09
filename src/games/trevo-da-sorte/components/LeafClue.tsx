import clsx from 'clsx';
import { ROTATIONS } from '../utils/constants';

type LeafClueProps = {
  leafIndex: LeafIndex;
  index: number;
  children: string;
};
export function LeafClue({ leafIndex, index, children }: LeafClueProps) {
  return (
    <div className={clsx(`y-clover__clue-${leafIndex}`, 'y-clover-clue')}>
      <span className={clsx(`y-clover-rotation--${ROTATIONS[index]}`, 'y-clover-clue-readonly')}>
        {children}
      </span>
    </div>
  );
}
