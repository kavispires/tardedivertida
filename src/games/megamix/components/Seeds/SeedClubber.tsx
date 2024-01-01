import { useEffectOnce } from 'react-use';
// AntDesign Resources
import { Button, Segmented, Space } from 'antd';
// Types
import type { SeedEntryClubberOutfit } from '../../utils/types';
// Hooks
import { useLoading } from 'hooks/useLoading';
// Utils
import { LETTERS } from 'utils/constants';
// Components
import { Translate } from 'components/language';
import { Title } from 'components/text';
import { ClubberAvatar } from '../../../../components/avatars/ClubberAvatar';

type SeedClubberProps = {
  seed: SeedEntryClubberOutfit;
  updateData: GenericComponent;
  user: GamePlayer;
  onSubmitData: GenericFunction;
  data: PlainObject;
};

export function SeedClubber({ seed, updateData, user, data, onSubmitData }: SeedClubberProps) {
  const { isLoading } = useLoading();

  useEffectOnce(() => {
    updateData({ clubberId: seed.outfits[0] });
  });

  const clubbers = (seed.outfits ?? []).map((cId: string, index: number) => ({
    label: (
      <div className="clubber-selection">
        <ClubberAvatar avatarId={user.avatarId} id={cId} />
        <div>{LETTERS[index]}</div>
      </div>
    ),
    value: cId,
  }));
  return (
    <div className="seed-container">
      <Title size="xx-small">
        <Translate
          pt="Escolha o que você vai usar pra balada"
          en="Choose what you want to wear for this party"
        />
      </Title>

      <Space className="space-container" direction="vertical">
        <Segmented
          options={clubbers}
          value={data.clubberId}
          onChange={(clubberId) => updateData({ clubberId })}
        />

        <Button onClick={() => onSubmitData({ data })} disabled={isLoading || user.ready}>
          <Translate pt="Confirmar roupa" en="Confirm outfit" />
        </Button>
      </Space>
    </div>
  );
}
