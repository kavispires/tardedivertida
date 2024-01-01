import clsx from 'clsx';
import { useMemo } from 'react';
// Types
import type { Slide } from '../utils/types';
// Ant Design Resources
import { Avatar as AntAvatar } from 'antd';
// Utils
import { getAnimationClass } from 'utils/helpers';
import { Translate } from 'components/language';
import { Card } from 'components/cards';
import { CanvasSVG } from 'components/canvas';
import { Avatar, AvatarName } from 'components/avatars';
// Componentes

type PageProps = {
  slide: Slide;
  players: GamePlayers;
  albumColor: string;
  currentPage: number;
  totalSlides: number;
};

export function Page({ slide, players, albumColor, currentPage, totalSlides }: PageProps) {
  const author = players[slide.author];
  const animationClass = useMemo(() => getAnimationClass('flipInY'), []);

  return (
    <div className="l-page" style={{ background: slide.type === 'cover' ? albumColor : 0 }}>
      <div className="l-page__pagination">
        <AntAvatar style={{ backgroundColor: albumColor }}>{currentPage + 1}</AntAvatar>
        <span className="l-page__pagination-of">
          <Translate pt="de" en="of" />
        </span>
        <AntAvatar style={{ backgroundColor: albumColor }}>{totalSlides}</AntAvatar>
      </div>

      {slide.type === 'cover' && (
        <div className={clsx('l-page__container', animationClass)} style={{ backgroundColor: albumColor }}>
          <Avatar id={author.avatarId} size={96} />
        </div>
      )}

      {slide.type === 'title' &&
        (currentPage === 0 ? (
          <div className={clsx('l-page__container', animationClass)}>
            <Card>{slide.content}</Card>
          </div>
        ) : (
          <div className={clsx('l-page__container l-page__text', animationClass)}>"{slide.content}"</div>
        ))}

      {slide.type === 'drawing' && (
        <CanvasSVG
          drawing={slide.content}
          className={clsx('l-page__container l-artwork', animationClass)}
          width={350}
        />
      )}

      {slide.type !== 'cover' && (
        <div className="l-page__author">
          <Translate pt="por " en="by " />
          <AvatarName player={author} addressUser />
        </div>
      )}
    </div>
  );
}
