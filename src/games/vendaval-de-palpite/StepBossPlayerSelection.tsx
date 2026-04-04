// Ant Design Resources
import { Space } from 'antd';
// Types
import type { GamePlayers } from 'types/game';
// Hooks
import { useHost } from 'hooks/useHost';
import { useLoading } from 'hooks/useLoading';
// Components
import { TransparentButton } from 'components/buttons/TransparentButton';
import { Translate } from 'components/language/Translate';
import { PlayerAvatarCard } from 'components/player/PlayerAvatarCard';
import { Step } from 'components/steps/Step';
import { Instruction } from 'components/text/Instruction';
import { RuleInstruction } from 'components/text/RuleInstruction';
import { StepTitle } from 'components/text/StepTitle';

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
        <Translate
          pt="Quem quer ser o Chefe?"
          en="Who wants to be the Boss?"
        />
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
                  <PlayerAvatarCard
                    key={`p-a-${player.id}`}
                    player={player}
                    withName
                    addressUser
                  />
                </TransparentButton>
              );
            }

            return (
              <PlayerAvatarCard
                key={`p-a-${player.id}`}
                player={player}
                withName
                addressUser
              />
            );
          })}
        </Space>
      </Instruction>

      <RuleInstruction type="wait">
        <Translate
          pt="O anfitrião selecionará o chefe"
          en="The host will select the boss"
        />
      </RuleInstruction>
    </Step>
  );
}
