import { useEffectOnce } from 'react-use';
// Ant Design Resources
import { Segmented } from 'antd';
// Types
import type { GamePlayer } from 'types/player';
// Hooks
import { useLoading } from 'hooks/useLoading';
// Utils
import { LETTERS } from 'utils/constants';
// Components
import { ClubberAvatar } from 'components/avatars/ClubberAvatar';
import { SendButton } from 'components/buttons';
import { Translate } from 'components/language';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { Title } from 'components/text';
// Internal
import type { SeedEntryClubberOutfit, SubmitAnswerPayload } from '../../utils/types';

type SeedClubberProps = {
  seed: SeedEntryClubberOutfit;
  updateData: GenericComponent;
  user: GamePlayer;
  onSubmitData: (payload: SubmitAnswerPayload) => void;
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
      <Title size="xx-small" colorScheme="light">
        <Translate
          pt="Escolha o que você vai usar pra balada"
          en="Choose what you want to wear for this party"
        />
      </Title>

      <SpaceContainer vertical>
        <Segmented
          options={clubbers}
          value={data.clubberId}
          onChange={(clubberId) => updateData({ clubberId })}
        />

        <SendButton onClick={() => onSubmitData({ data })} disabled={isLoading || user.ready}>
          <Translate pt="Confirmar roupa" en="Confirm outfit" />
        </SendButton>
      </SpaceContainer>
    </div>
  );
}
