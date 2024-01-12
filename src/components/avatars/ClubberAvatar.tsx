// Images
import clubbers from 'assets/images/clubbers.svg';
// Components
import { type CustomAvatarProps, CustomAvatarWrapper } from './CustomAvatarWrapper';
// Sass
import './ClubberAvatar.scss';

/**
 * Clubber Avatar
 */
export const ClubberAvatar = (props: CustomAvatarProps) => {
  return <CustomAvatarWrapper sprite={clubbers} prefix="clubber" {...props} />;
};
