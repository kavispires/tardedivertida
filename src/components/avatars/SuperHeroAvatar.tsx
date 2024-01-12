// Images
import superHeroes from 'assets/images/super-heroes.svg';
// Components
import { type CustomAvatarProps, CustomAvatarWrapper } from './CustomAvatarWrapper';
// Sass
import './ClubberAvatar.scss';

/**
 * Clubber Avatar
 */
export const SuperHeroAvatar = (props: CustomAvatarProps) => {
  return <CustomAvatarWrapper sprite={superHeroes} prefix="super-hero" {...props} />;
};
