// Ant Design Resources
import { Space } from 'antd';
// Hooks
import { useLoading } from 'hooks/useLoading';
import { useHost } from 'hooks/useHost';
// Icons
import { AnimatedClockIcon } from 'icons/AnimatedClockIcon';
// Components
import { AvatarCard, IconAvatar } from 'components/avatars';
import { TransparentButton } from 'components/buttons';
import { Step } from 'components/steps';
import { Instruction, Title } from 'components/text';
import { Translate } from 'components/language';

type StepBossPlayerSelectionProps = {
  players: GamePlayers;
  onBossPlayerClick: GenericFunction;
};

export function StepBossPlayerSelection({ players, onBossPlayerClick }: StepBossPlayerSelectionProps) {
  const { isLoading } = useLoading();
  const isVIP = useHost();

  return (
    <Step key={1}>
      <Title>
        <IconAvatar icon={<AnimatedClockIcon />} size="large" />
        <br />
        <Translate pt="Quem quer ser o Chefe?" en="Who wants to be the Boss?" />
      </Title>

      <Instruction contained>
        <Space>
          {Object.values(players).map((player) => {
            if (isVIP) {
              return (
                <TransparentButton
                  key={`p-bt-${player.id}`}
                  disabled={isLoading}
                  onClick={() => onBossPlayerClick({ bossId: player.id })}
                >
                  <AvatarCard key={`p-a-${player.id}`} player={player} withName addressUser />
                </TransparentButton>
              );
            }

            return <AvatarCard key={`p-a-${player.id}`} player={player} withName addressUser />;
          })}
        </Space>
      </Instruction>

      <Instruction>
        (
        <Translate pt="O administrator selecionará o chefe" en="The Admin will select the boss" />)
      </Instruction>
    </Step>
  );
}
