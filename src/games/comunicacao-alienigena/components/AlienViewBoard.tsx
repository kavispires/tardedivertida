import { CanvasSVG } from 'components/canvas';
import { ALIEN_CANVAS } from '../utils/constants';

type AlienViewBoardProps = {
  request: string;
};

export function AlienViewBoard({ request }: AlienViewBoardProps) {
  return (
    <CanvasSVG
      drawing={request}
      width={ALIEN_CANVAS.WIDTH}
      height={ALIEN_CANVAS.HEIGHT}
      viewBox={`0 0 ${ALIEN_CANVAS.WIDTH} ${ALIEN_CANVAS.HEIGHT}`}
      strokeWidth="large"
      className="alien-canvas alien-canvas--small"
    />
  );
}
