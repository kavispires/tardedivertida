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
  className?: string;
};

export function AlienViewBoard({ request, isAlienBot, size, className }: AlienViewBoardProps) {
  const width = size === 'small' ? ALIEN_CANVAS.WIDTH / 2 : ALIEN_CANVAS.WIDTH;
  const height = size === 'small' ? ALIEN_CANVAS.HEIGHT / 2 : ALIEN_CANVAS.HEIGHT;

  if (isAlienBot) {
    if (typeof request === 'string') {
      return (
        <div
          className={clsx('alien-canvas alien-canvas--small alien-canvas--bot', className)}
          style={{ width: `${width}px`, height: `${height}px` }}
        >
          <SignCard id={`${request}`} width={75} className="transparent" />
        </div>
      );
    }

    return (
      <div
        className={clsx('alien-canvas alien-canvas--small alien-canvas--bot', className)}
        style={size === 'small' ? undefined : { width: `${width}px`, height: `${height}px` }}
      >
        {request.map((entry) => {
          const isNegative = entry.startsWith('!');
          const isVery = entry.startsWith('+');
          const id = entry.substring(isNegative || isVery ? 1 : 0);

          return (
            <SignCard
              key={`request-${id}`}
              id={id}
              width={75}
              className={clsx('bot-sign', isNegative && 'bot-sign--negative', isVery && 'bot-sign--very')}
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
      viewBox={`0 0 ${ALIEN_CANVAS.WIDTH} ${ALIEN_CANVAS.HEIGHT}`}
      strokeWidth="large"
      className={clsx('alien-canvas alien-canvas--small', className)}
    />
  );
}
