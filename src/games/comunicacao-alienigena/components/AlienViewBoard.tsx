import clsx from 'clsx';
// Utils
import { ALIEN_CANVAS } from '../utils/constants';
// Components
import { CanvasSVG } from 'components/canvas';
import { SignCard } from 'components/cards/SignCard';

type AlienViewBoardProps = {
  request: string | string[];
  isAlienBot?: boolean;
  size?: 'normal' | 'small';
};

export function AlienViewBoard({ request, isAlienBot, size }: AlienViewBoardProps) {
  const width = size === 'small' ? ALIEN_CANVAS.WIDTH / 2 : ALIEN_CANVAS.WIDTH;
  const height = size === 'small' ? ALIEN_CANVAS.HEIGHT / 2 : ALIEN_CANVAS.HEIGHT;

  if (isAlienBot) {
    if (typeof request === 'string') {
      return (
        <div
          className="alien-canvas alien-canvas--small alien-canvas--bot"
          style={{ width: `${width}px`, height: `${height}px` }}
        >
          <SignCard id={`${request}`} width={75} />
        </div>
      );
    }

    return (
      <div
        className="alien-canvas alien-canvas--small alien-canvas--bot"
        style={{ width: `${width}px`, height: `${height}px` }}
      >
        {request.map((entry) => {
          const isNegative = entry.startsWith('!');
          const id = entry.substring(isNegative ? 1 : 0);

          return (
            <SignCard
              key={`request-${id}`}
              id={id}
              width={75}
              className={clsx('bot-sign', isNegative && 'bot-sign--negative')}
            />
          );
        })}
      </div>
    );
  }

  return (
    <CanvasSVG
      drawing={request as string}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      strokeWidth="large"
      className="alien-canvas alien-canvas--small"
    />
  );
}
