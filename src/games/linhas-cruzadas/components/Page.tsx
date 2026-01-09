import clsx from 'clsx';
import { useMemo } from 'react';
// Ant Design Resources
import { Avatar } from 'antd';
// Types
import type { GamePlayers } from 'types/player';
// Utils
import { getAnimationClass } from 'utils/helpers';
// Components
import { PlayerAvatar, PlayerAvatarName } from 'components/avatars';
import { CanvasSVG } from 'components/canvas';
import { Card } from 'components/cards';
import { Translate } from 'components/language';
// Internal
import type { Slide } from '../utils/types';

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
    <div
      className="l-page"
      style={{ background: slide.type === 'cover' ? albumColor : 0 }}
    >
      <div className="l-page__pagination">
        <Avatar style={{ backgroundColor: albumColor }}>{currentPage + 1}</Avatar>
        <span className="l-page__pagination-of">
          <Translate
            pt="de"
            en="of"
          />
        </span>
        <Avatar style={{ backgroundColor: albumColor }}>{totalSlides}</Avatar>
      </div>

      {slide.type === 'cover' && (
        <div
          className={clsx('l-page__container', animationClass)}
          style={{ backgroundColor: albumColor }}
        >
          <PlayerAvatar
            avatarId={author.avatarId}
            size={96}
          />
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
          <Translate
            pt="por "
            en="by "
          />
          <PlayerAvatarName
            player={author}
            addressUser
          />
        </div>
      )}
    </div>
  );
}
