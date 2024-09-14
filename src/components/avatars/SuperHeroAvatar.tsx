// Internal
import { type CustomAvatarProps, CustomAvatarWrapper } from './CustomAvatarWrapper';
// Images
import superHeroes from 'assets/images/super-heroes.svg';
// Sass
import './ClubberAvatar.scss';

/**
 * Clubber Avatar
 */
export const SuperHeroAvatar = (props: CustomAvatarProps) => {
  return <CustomAvatarWrapper sprite={superHeroes} prefix="super-hero" {...props} />;
};
