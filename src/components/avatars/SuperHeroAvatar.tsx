// Internal
import { type CustomAvatarProps, CustomAvatarWrapper } from './_internal/CustomAvatarWrapper';
// Images
import superHeroes from 'assets/images/super-heroes.svg?url';

/**
 * Super Hero Avatar with Player Avatar on top
 */
export const SuperHeroAvatar = (props: CustomAvatarProps) => {
  return (
    <CustomAvatarWrapper
      sprite={superHeroes}
      prefix="super-hero"
      {...props}
    />
  );
};
