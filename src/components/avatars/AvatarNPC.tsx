import clsx from 'clsx';
// Ant Design Resources
import { Avatar } from 'antd';
// Components
import { Translate } from 'components/language';
// Sass
import './AvatarName.scss';

type AvatarNPCProps = {
  /**
   * The component size
   */
  size?: 'small' | 'default' | 'large';
  /**
   * Optional custom class name
   */
  className?: string;
  /**
   * Indicates if the description (animal type) should be displayed
   */
  withDescription?: boolean;
  /**
   * If text should be displayed in uppercase
   */
  uppercase?: boolean;
};

export const AvatarNPC = ({
  size = 'small',
  className = '',
  withDescription = false,
  uppercase = false,
}: AvatarNPCProps) => {
  const baseClass = 'avatar-name';

  return (
    <span className={clsx(baseClass, uppercase && `${baseClass}--uppercase`, className)}>
      <Avatar
        src={
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
            <rect width="100" height="100" fill="#7f8693" rx="50"></rect>
            <path
              fill="#fff"
              d="M81.86 38.84h-3.44V28A2.65 2.65 0 0076 25.49H52.46V10.42h-4.92v15.07H24A2.65 2.65 0 0021.58 28v10.84h-3.44a2.41 2.41 0 00-2.45 2.46v16.21A2.41 2.41 0 0018.14 60h3.44v15.12A2.65 2.65 0 0024 77.58h52a2.65 2.65 0 002.46-2.46V60h3.44a2.41 2.41 0 002.45-2.46V41.3a2.41 2.41 0 00-2.49-2.46zm-50.12 5.81a7.13 7.13 0 117.12 7.13 7.12 7.12 0 01-7.12-7.13zM60.81 66H39.19v-4.88h21.62zm7.45-21.38a7.13 7.13 0 01-7.12 7.13 7.21 7.21 0 117.12-7.29z"
            ></path>
          </svg>
        }
        size={size}
      />
      <span className="avatar-name__name">
        <Translate pt="Computador" en="NPC" />
      </span>
      {withDescription && <span className="avatar-name__name">, o robô</span>}
    </span>
  );
};
