import clsx from 'clsx';
// Images
import superHeroes from 'assets/images/super-heroes.svg';
import avatars from 'assets/images/avatars.svg';
// Utils
import { AVATARS } from 'utils/avatars';

type SuperHeroAvatarProps = {
  id?: string;
  superHeroId?: string;
  animate?: boolean;
  /**
   * Optional custom class name
   */
  className?: string;
  width?: number;
  [key: string]: any;
};

export const SuperHeroAvatar = ({
  id = '0',
  superHeroId = '0',
  animate = false,
  className = '',
  width = 60,
  ...props
}: SuperHeroAvatarProps) => {
  const baseClass = 'super-hero';

  const avatarData = AVATARS[id];

  return (
    <svg
      viewBox="0 0 100 200"
      className={clsx(baseClass, animate && `${baseClass}--bounce`, className)}
      style={{
        animationDuration: `${500 + (Math.random() + Number(superHeroId)) * 53}ms`,
        width: `${width}px`,
      }}
      {...props}
    >
      {/* pin */}
      <path
        fill={avatarData.color}
        d="M75 25a25 25 0 00-50 0 24.89 24.89 0 005.67 15.85 26.4 26.4 0 002.53 2.65L50 61.12l16.78-17.59a26.4 26.4 0 002.53-2.65A24.89 24.89 0 0075 25z"
      ></path>

      {/* clubber */}
      <svg viewBox="0 0 512 512">
        <use href={superHeroes + `#super-hero-${superHeroId}`}></use>
      </svg>

      {/* game avatar */}
      <foreignObject x="25" y="0" width="50" height="50" style={{ borderRadius: '50%' }}>
        <svg viewBox="0 0 100 100">
          <use href={avatars + `#avatar-${id}`}></use>
        </svg>
      </foreignObject>
    </svg>
  );
};
