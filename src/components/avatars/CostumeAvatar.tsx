// Images
import costumes from 'assets/images/costumes.svg';
// Components
import { type CustomAvatarProps, CustomAvatarWrapper } from './CustomAvatarWrapper';
// Sass
import './ClubberAvatar.scss';

/**
 * Clubber Avatar
 */
export const CostumeAvatar = (props: CustomAvatarProps) => {
  return <CustomAvatarWrapper sprite={costumes} prefix="costume" viewBox="0 0 100 155" {...props} />;
};
