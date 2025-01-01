// Ant Design Resources
import { Space } from 'antd';
// Types
import type { GamePlayers } from 'types/player';
// Hooks
import { useHost } from 'hooks/useHost';
import { useLoading } from 'hooks/useLoading';
// Components
import { AvatarCard } from 'components/avatars';
import { TransparentButton } from 'components/buttons';
import { Translate } from 'components/language';
import { Step } from 'components/steps';
import { Instruction, RuleInstruction, StepTitle } from 'components/text';

type StepBossPlayerSelectionProps = {
  players: GamePlayers;
  onBossPlayerClick: GenericFunction;
};

export function StepBossPlayerSelection({ players, onBossPlayerClick }: StepBossPlayerSelectionProps) {
  const { isLoading } = useLoading();
  const isHost = useHost();

  return (
    <Step key={1}>
      <StepTitle wait>
        <Translate pt="Quem quer ser o Chefe?" en="Who wants to be the Boss?" />
      </StepTitle>

      <Instruction contained>
        <Space>
          {Object.values(players).map((player) => {
            if (isHost) {
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

      <RuleInstruction type="wait">
        <Translate pt="O anfitrião selecionará o chefe" en="The host will select the boss" />)
      </RuleInstruction>
    </Step>
  );
}
