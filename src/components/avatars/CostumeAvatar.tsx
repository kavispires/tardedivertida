// Internal
import { type CustomAvatarProps, CustomAvatarWrapper } from './_internal/CustomAvatarWrapper';
// Images
import costumes from '@assets/images/costumes.svg?url';

/**
 * Clubber Avatar with Player Avatar on top
 */
export const CostumeAvatar = (props: CustomAvatarProps) => {
  return (
    <CustomAvatarWrapper
      sprite={costumes}
      prefix="costume"
      viewBox="0 0 100 155"
      {...props}
    />
  );
};
