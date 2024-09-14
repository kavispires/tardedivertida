// Ant Design Resources
import { Space } from 'antd';
// Icons
import { UnderConstructionIcon } from 'icons/UnderConstructionIcon';
// Components
import { IconAvatar } from 'components/avatars';
import { Translate } from 'components/language';
import { Title } from 'components/text';
// Amt Design Resources

export function FallbackComponent(_: unknown) {
  return (
    <Space className="space-container" direction="vertical" align="center">
      <IconAvatar size="large" icon={<UnderConstructionIcon />} />
      <Title size="xx-small">
        <Translate pt="Algo errado não está certo" en="Something wrong is not right" />
      </Title>
    </Space>
  );
}
