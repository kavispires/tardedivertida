// Hooks
import { useLoading } from '@hooks/useLoading';
import { useMock } from '@hooks/useMock';
// Components
import { TransparentButton } from '@components/buttons/TransparentButton';
import { TextCard } from '@components/cards/TextCard';
import { Translate } from '@components/language/Translate';
import { SpaceContainer } from '@components/layout/SpaceContainer';
import { PlayerAvatarCard } from '@components/player/PlayerAvatarCard';
import { RuleInstruction } from '@components/text/RuleInstruction';
// Internal
import type { TrackProps } from '../../utils/types';
import { mockSelection } from '../../utils/mock';
import { MinigameTitle } from '../MinigameTitle';

export const TrackMegamixWhoSaidThis = ({ track, onSubmitAnswer, user, players }: TrackProps) => {
  const { isLoading } = useLoading();

  const onSelect = (playerId: UID) => {
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
      <TextCard>"{track.data.card.text}"</TextCard>

      <SpaceContainer>
        {track.data.card.options.map((playerId: UID) => {
          const player = players[playerId];
          return (
            <TransparentButton
              key={playerId}
              onClick={() => onSelect(playerId)}
              disabled={isLoading || user.ready}
            >
              <PlayerAvatarCard
                player={player}
                withName
                withRoundCorners
              />
            </TransparentButton>
          );
        })}
      </SpaceContainer>
    </>
  );
};
