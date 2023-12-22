// Images
import clubbers from 'assets/images/clubbers.svg';
// Components
import { CustomAvatarProps, CustomAvatarWrapper } from './CustomAvatarWrapper';
// Sass
import './ClubberAvatar.scss';

/**
 * Clubber Avatar
 */
export const ClubberAvatar = (props: CustomAvatarProps) => {
  return (
    <CustomAvatarWrapper
      sprite={clubbers}
      prefix="clubber"
      baseClassName="clubber-avatar"
      animationClassName="bounce"
      {...props}
    />
  );
};
