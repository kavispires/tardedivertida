import clsx from 'clsx';
// Utils
import { AVATARS } from 'utils/avatars';
// Images
import avatars from 'assets/images/avatars.svg';
import sheep from 'assets/images/sheep.svg';

type SheepAvatarProps = {
  id?: string;
  sheepId?: string;
  animate?: boolean;
  /**
   * Optional custom class name
   */
  className?: string;
  width?: number;
  [key: string]: any;
};

export const SheepAvatar = ({
  id = '25',
  sheepId = '25',
  animate = false,
  className = '',
  width = 100,
  ...props
}: SheepAvatarProps) => {
  const baseClass = 'sheep-avatar';

  const avatarData = AVATARS[id];

  return (
    <svg
      viewBox="0 0 100 155"
      className={clsx(baseClass, animate && `${baseClass}--bounce`, className)}
      style={{
        animationDuration: `${2000 + (Math.random() + Number(sheepId)) * 100}ms`,
        width: `${width}px`,
      }}
      {...props}
    >
      {/* shadow */}
      <ellipse cx="50.96" cy="148.53" opacity="0.2" rx="28.18" ry="4.66"></ellipse>
      {/* feet */}
      <g>
        <ellipse cx="31.7" cy="139.22" rx="4.23" ry="10.75"></ellipse>
        <ellipse cx="67.83" cy="139.22" rx="4.23" ry="10.75"></ellipse>
      </g>
      <path
        fill="#fff"
        d="M99.92 102.37A19.51 19.51 0 0081 82.87a19.52 19.52 0 00-31.06-15.76 19.52 19.52 0 00-31.06 15.74 19.52 19.52 0 000 39 19.52 19.52 0 0031.06 15.74A19.52 19.52 0 0081 121.89a19.52 19.52 0 0018.92-19.52z"
      ></path>
      <path d="M65 80.2a7.74 7.74 0 001-4c0-3.17-1.63-5.74-3.64-5.74-1.73 0-3.17 1.91-3.54 4.46A18.87 18.87 0 0041 75c-.36-2.57-1.81-4.49-3.55-4.49-2 0-3.64 2.57-3.64 5.74a7.63 7.63 0 001 4A18.92 18.92 0 1065 80.2z"></path>
      <path
        fill={avatarData.color}
        d="M75 25a25 25 0 00-50 0 24.89 24.89 0 005.67 15.85 26.4 26.4 0 002.53 2.65L50 61.12l16.78-17.59a26.4 26.4 0 002.53-2.65A24.89 24.89 0 0075 25z"
      ></path>

      <svg viewBox="0 0 100 155">
        <use href={sheep + `#sheep-face-${sheepId}`}></use>
      </svg>

      <foreignObject x="25" y="0" width="50" height="50" style={{ borderRadius: '50%' }}>
        <svg viewBox="0 0 100 100">
          <use href={avatars + `#avatar-${id}`}></use>
        </svg>
      </foreignObject>
    </svg>
  );
};
