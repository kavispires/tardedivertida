// Design Resources
import { Avatar, AvatarProps } from 'antd';
// Helpers
import { kebabToPascal } from '../../utils/helpers';
// Components
import * as IconIllustrations from '../icons';

const IconIllustrationsComponents: any = IconIllustrations;

interface AvatarIconProps extends AvatarProps {
  type: string;
}

export function AvatarIcon({ type, ...props }: AvatarIconProps) {
  const Icon: any =
    IconIllustrationsComponents[kebabToPascal(type ?? 'multitask')] ?? IconIllustrationsComponents.Multitask;

  return <Avatar src={<Icon />} {...props} />;
}
