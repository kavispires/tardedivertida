// Internal
import { type CustomAvatarProps, CustomAvatarWrapper } from './_internal/CustomAvatarWrapper';
// Images
import clubbers from '@assets/images/clubbers.svg?url';

/**
 * Clubber Avatar with Player Avatar on top
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
