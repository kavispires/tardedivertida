import type { ComponentProps } from 'react';
// Ant Design Resources
import { Flex } from 'antd';
// Types
import type { GamePlayers } from 'types/player';
// Hooks
import { useHost } from 'hooks/useHost';
import { useLoading } from 'hooks/useLoading';
// Utils
import { sortPlayers } from 'utils/helpers';
// Components
import { AvatarCard } from 'components/avatars';
import { TransparentButton } from 'components/buttons';
import { Translate } from 'components/language';
import { Step, type StepProps } from 'components/steps';
import { Instruction, RuleInstruction, StepTitle, type RuleInstructionProps } from 'components/text';

type StepSelectPlayerProps = {
  players: GamePlayers;
  onSubmitPlayer: (playerId: PlayerId) => void;
  titleProps: ComponentProps<typeof StepTitle>;
  ruleInstructionProps: RuleInstructionProps;
} & Pick<StepProps, 'announcement'>;

export function StepSelectPlayer({
  players,
  announcement,
  onSubmitPlayer,
  titleProps,
  ruleInstructionProps,
}: StepSelectPlayerProps) {
  const { isLoading } = useLoading();
  const isHost = useHost();

  return (
    <Step fullWidth announcement={announcement}>
      <StepTitle wait {...titleProps} />

      <RuleInstruction {...ruleInstructionProps} />

      <Instruction contained>
        <Flex className="div-container" wrap="wrap" gap={8}>
          {sortPlayers(players).map((player) => {
            if (isHost) {
              return (
                <TransparentButton
                  key={`p-bt-${player.id}`}
                  disabled={isLoading}
                  onClick={() => onSubmitPlayer(player.id)}
                >
                  <AvatarCard
                    key={`p-a-${player.id}`}
                    player={player}
                    withName
                    addressUser
                    className="border-radius"
                  />
                </TransparentButton>
              );
            }

            return (
              <AvatarCard
                key={`p-a-${player.id}`}
                player={player}
                withName
                addressUser
                className="border-radius"
              />
            );
          })}
        </Flex>
      </Instruction>

      <RuleInstruction type="event">
        <Translate pt="O Anfitrião selecionará o jogador" en="The Host will select the player" />
      </RuleInstruction>
    </Step>
  );
}
