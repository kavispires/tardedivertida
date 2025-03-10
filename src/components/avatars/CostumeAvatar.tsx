// Internal
import { type CustomAvatarProps, CustomAvatarWrapper } from './CustomAvatarWrapper';
// Images
import costumes from 'assets/images/costumes.svg?url';
// Sass
import './ClubberAvatar.scss';

/**
 * Clubber Avatar
 */
export const CostumeAvatar = (props: CustomAvatarProps) => {
  return <CustomAvatarWrapper sprite={costumes} prefix="costume" viewBox="0 0 100 155" {...props} />;
};
