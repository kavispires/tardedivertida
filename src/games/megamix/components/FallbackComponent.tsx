// Icons
import { UnderConstructionIcon } from '@icons/UnderConstructionIcon';
// Components
import { Icon } from '@components/general/Icon';
import { Translate } from '@components/language/Translate';
import { SpaceContainer } from '@components/layout/SpaceContainer';
import { Title } from '@components/text/Title';

export function FallbackComponent(_: unknown) {
  return (
    <SpaceContainer vertical>
      <Icon
        size="large"
        icon={<UnderConstructionIcon />}
      />
      <Title size="xx-small">
        <Translate
          pt="Algo errado não está certo"
          en="Something wrong is not right"
        />
      </Title>
    </SpaceContainer>
  );
}
