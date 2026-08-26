import { useAnimate, useAnimation, motion } from 'motion/react';
// Ant Design Resources
import { Button, Space } from 'antd';
// Types
import type { GamePlayer } from 'types/game';
// Hooks
import { useLoading } from '@hooks/useLoading';
import { useMock } from '@hooks/useMock';
import { useMouseDirection } from '@hooks/useMouseDirection';
import { useSortedPlayers } from '@hooks/useSortedPlayers';
// Icons
import { ShooterIcon } from '@icons/ShooterIcon';
// Components
import { Icon } from '@components/general/Icon';
import { Translate } from '@components/language/Translate';
import { SpaceContainer } from '@components/layout/SpaceContainer';
import { PlayerAvatar } from '@components/player/PlayerAvatar';
import { RuleInstruction } from '@components/text/RuleInstruction';
// Internal
import type { TrackProps } from '../../utils/types';
import { mockSelection } from '../../utils/mock';
import { MinigameTitle } from '../MinigameTitle';

export const TrackQuemNaoMata = ({ track, onSubmitAnswer, players }: TrackProps) => {
  const { isLoading } = useLoading();
  const sortedPlayers = useSortedPlayers(players);

  const onSelect = (value: string) => {
    onSubmitAnswer({
      data: { value },
    });
  };

  // DEV Mock
  useMock(() => {
    onSelect(mockSelection(Object.keys(players)));
  });

  return (
    <>
      <MinigameTitle track={track} />
      <Space
        orientation="vertical"
        align="center"
        className="contained margin"
      >
        <RuleInstruction type="action">
          <Translate
            pt="Estamos num impasse! O primeiro a se mexer leva bala! Em quem você atira primeiro? (Pode ser você mesmo)"
            en="A standoff! Who are you going to shoot first? (It could be yourself)"
          />
        </RuleInstruction>

        <SpaceContainer wrap>
          {sortedPlayers.map((player) => {
            return (
              <PlayerShooter
                key={player.id}
                player={player}
                onSelect={onSelect}
                isLoading={isLoading}
              />
            );
          })}
        </SpaceContainer>
      </Space>
    </>
  );
};

type PlayerShooterProps = {
  player: GamePlayer;
  onSelect: (value: string) => void;
  isLoading: boolean;
};

function PlayerShooter({ player, onSelect, isLoading }: PlayerShooterProps) {
  const [refShooter] = useAnimate();
  const controls = useAnimation();
  const shooterDirection = useMouseDirection(refShooter, 'horizontal');

  return (
    <motion.div
      ref={refShooter}
      className="qnm-shooter"
      animate={controls}
    >
      <Icon
        icon={<ShooterIcon />}
        size={48}
        style={{
          transform: `scaleX(${shooterDirection === 'left' ? -1 : 1})`,
          transition: 'transform 0.2s ease-in-out',
        }}
      />
      <Button
        icon={
          <PlayerAvatar
            avatarId={player.avatarId}
            size="small"
          />
        }
        onClick={() => onSelect(player.id)}
        type="primary"
        loading={isLoading}
        disabled={isLoading}
      >
        {player.name}
      </Button>
    </motion.div>
  );
}
