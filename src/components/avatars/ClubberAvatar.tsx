// Internal
import { type CustomAvatarProps, CustomAvatarWrapper } from './CustomAvatarWrapper';
// Images
import clubbers from 'assets/images/clubbers.svg?url';

/**
 * Clubber Avatar
 */
export const ClubberAvatar = (props: CustomAvatarProps) => {
  return (
    <CustomAvatarWrapper
      sprite={clubbers}
      prefix="clubber"
      {...props}
    />
  );
};
