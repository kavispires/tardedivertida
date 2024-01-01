// AntDesign Resources
import { Space } from 'antd';
// Types
import type { TrackProps } from '../../utils/types';
// Hooks
import { useMock } from 'hooks/useMock';
import { useLoading } from 'hooks/useLoading';
// Utils
import { mockSelection } from '../../utils/mock';
// Components
import { Translate } from 'components/language';
import { RuleInstruction } from 'components/text';
import { MinigameTitle } from '../MinigameTitle';

import { TransparentButton } from 'components/buttons';
import { AvatarCard } from 'components/avatars';
import { Card } from 'components/cards';

export const TrackMegamixWhoSaidThis = ({ track, onSubmitAnswer, user, players }: TrackProps) => {
  const { isLoading } = useLoading();

  const onSelect = (playerId: PlayerId) => {
    onSubmitAnswer({
      data: { value: playerId },
    });
  };

  // DEV Mock
  useMock(() => {
    onSelect(mockSelection(track.data.card.options));
  });

  return (
    <>
      <MinigameTitle title={{ pt: 'Quem disse isso?', en: 'Who Said This?' }} />
      <RuleInstruction type="action">
        <Translate
          pt="Selecione qual jogador você acha que disse esse fato:"
          en="Select the player who said this fact:"
        />
      </RuleInstruction>
      <Card hideHeader>"{track.data.card.text}"</Card>

      <Space direction="vertical" align="center" className="contained margin">
        <Space className="space-container">
          {track.data.card.options.map((playerId: PlayerId) => {
            const player = players[playerId];
            return (
              <TransparentButton onClick={() => onSelect(playerId)} disabled={isLoading || user.ready}>
                <AvatarCard player={player} withName />
              </TransparentButton>
            );
          })}
        </Space>
      </Space>
    </>
  );
};
