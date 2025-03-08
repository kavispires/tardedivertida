import clsx from 'clsx';
import { keyBy } from 'lodash';
import { useMemo } from 'react';
// Components
import { CanvasSVG } from 'components/canvas';
import { SignCard } from 'components/cards/SignCard';
import { type AlienAttribute, alienAttributesUtils } from 'components/toolKits/AlienAttributes';
// Internal
import { ALIEN_CANVAS } from '../utils/constants';

type AlienViewBoardProps = {
  request: string;
  isAlienBot?: boolean;
  size?: 'normal' | 'small';
  className?: string;
  sentenceMode?: boolean;
  attributes: AlienAttribute[];
};

export function AlienViewBoard({
  request,
  isAlienBot,
  size,
  className,
  sentenceMode,
  attributes,
}: AlienViewBoardProps) {
  const width = size === 'small' ? ALIEN_CANVAS.WIDTH / 2 : ALIEN_CANVAS.WIDTH;
  const height = size === 'small' ? ALIEN_CANVAS.HEIGHT / 2 : ALIEN_CANVAS.HEIGHT;

  const sentence = useRequestSentence(sentenceMode ? request : '', attributes);

  if (isAlienBot) {
    if (sentenceMode && sentence.length === 0) {
      return null;
    }

    if (!sentenceMode) {
      return (
        <div
          className={clsx('alien-canvas alien-canvas--small alien-canvas--bot', className)}
          style={{ width: `${width}px`, height: `${height}px` }}
        >
          <SignCard id={request} width={72} className="transparent" />
        </div>
      );
    }

    return (
      <div
        className={clsx('alien-canvas alien-canvas--small alien-canvas--bot', className)}
        style={size === 'small' ? undefined : { width: `${width}px`, height: `${height}px` }}
      >
        {sentence.map((entry) => {
          return (
            <SignCard
              key={`request-${entry?.spriteId}`}
              id={entry.spriteId}
              width={72}
              className={clsx('bot-sign', `bot-sign--${entry.variant}`)}
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

function useRequestSentence(signature: string, alienAttributes: AlienAttribute[]) {
  // biome-ignore lint/correctness/useExhaustiveDependencies: only signature matters
  return useMemo(() => {
    if (signature) {
      const spritesDictionary = keyBy(alienAttributes, 'id');
      return alienAttributesUtils.parseItemSignature(signature).map((entry) => {
        entry.spriteId = spritesDictionary[entry.id].spriteId;
        return entry;
      });
    }
    return [];
  }, [signature]);
}
