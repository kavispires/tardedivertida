import clsx from 'clsx';
// Utils
import { AVATARS } from 'utils/avatars';
// Images
import avatars from 'assets/images/avatars.svg';
// Sass
import './ClubberAvatar.scss';

export type CustomAvatarProps = {
  /**
   * The avatarId id
   */
  id: string;
  /**
   * The avatar id
   */
  avatarId?: string;
  /**
   * Should animate? (@default: false)
   */
  animate?: boolean;
  /**
   * Optional custom class name
   */
  className?: string;
  /**
   * Optional custom width (@default: 60)
   */
  width?: number;
} & React.SVGProps<SVGSVGElement>;

type CustomAvatarWrapperProps = {
  /**
   * The svg sprite collection
   */
  sprite: string;
  /**
   * The prefix the accompanies the sprite number id (clubber-, super-hero-)
   */
  prefix: string;
  /**
   * ViewBox overRider when sprites are in a different size then 512x512
   */
  viewBox?: string;
} & CustomAvatarProps;

export const CustomAvatarWrapper = ({
  sprite,
  prefix,
  id,
  avatarId,
  animate = false,
  className = '',
  width = 60,
  viewBox,
  ...props
}: CustomAvatarWrapperProps) => {
  const avatarData = AVATARS?.[avatarId ?? 0];
  const hasAvatar = Boolean(avatarId);

  return (
    <svg
      viewBox={`0 0 100 ${hasAvatar ? 200 : 100}`}
      className={clsx(`${prefix}-avatar`, animate && `${prefix}-avatar--animated`, className)}
      style={{
        animationDuration: `${500 + (Math.random() + Number(id)) * 53}ms`,
        width: `${width}px`,
      }}
      {...props}
    >
      {/* pin */}
      {hasAvatar && (
        <path
          fill={avatarData.color}
          d="M75 25a25 25 0 00-50 0 24.89 24.89 0 005.67 15.85 26.4 26.4 0 002.53 2.65L50 61.12l16.78-17.59a26.4 26.4 0 002.53-2.65A24.89 24.89 0 0075 25z"
        ></path>
      )}

      {/* content */}
      <svg viewBox={viewBox ?? '0 0 512 512'}>
        <use href={sprite + `#${prefix}-${id}`}></use>
      </svg>

      {/* game avatar */}
      {hasAvatar && (
        <foreignObject x="25" y="0" width="50" height="50" style={{ borderRadius: '50%' }}>
          <svg viewBox="0 0 100 100">
            <use href={avatars + `#avatar-${avatarId}`}></use>
          </svg>
        </foreignObject>
      )}
    </svg>
  );
};
