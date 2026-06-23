import { motion } from 'motion/react';
// Ant Design Resources
import { Tooltip } from 'antd';
// Utils
import { getAnimation } from '@utils/animations';
// Icons
import { TeenDetectiveIcon } from '@icons/TeenDetectiveIcon';
// Components
import { Icon } from '@components/general/Icon';
import { Translate } from '@components/language/Translate';

export function DetectiveToken() {
  return (
    <motion.div
      className="detective-token"
      {...getAnimation('bounceIn')}
    >
      <Tooltip
        title={
          <Translate
            en="The detective is here"
            pt="O detetive está aqui"
          />
        }
      >
        <Icon
          icon={<TeenDetectiveIcon />}
          size={48}
          className="detective-token__avatar"
        />
      </Tooltip>
    </motion.div>
  );
}
