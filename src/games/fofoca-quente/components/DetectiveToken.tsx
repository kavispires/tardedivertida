import { motion } from 'motion/react';
// Utils
import { getAnimation } from 'utils/animations';
// Icons
import { TeenDetectiveIcon } from 'icons/TeenDetectiveIcon';
// Components
import { IconAvatar } from 'components/avatars';

export function DetectiveToken() {
  return (
    <motion.div
      className="detective-token"
      {...getAnimation('bounceIn')}
    >
      <IconAvatar
        icon={<TeenDetectiveIcon />}
        size={48}
        className="detective-token__avatar"
      />
    </motion.div>
  );
}
