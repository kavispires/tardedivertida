import { sample, shuffle } from 'lodash';
import type { ComponentProps } from 'react';
// Ant Design Resources
import { Flex } from 'antd';
// Types
import type { GamePlayers } from 'types/game';
// Hooks
import { useHost } from 'hooks/useHost';
import { useLoading } from 'hooks/useLoading';
// Utils
import { sortPlayers } from 'utils/helpers';
// Components
import { SendButton, TransparentButton } from 'components/buttons';
import { Translate } from 'components/language';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { PlayerAvatarCard } from 'components/player';
import { Step, type StepProps } from 'components/steps';
import { Instruction, RuleInstruction, StepTitle, type RuleInstructionProps } from 'components/text';

type StepSelectPlayerProps = {
  /**
   * The game players object
   */
  players: GamePlayers;
  /**
   * Callback function when a player is selected and submitted
   */
  onSubmitPlayer: (playerId: UID) => void;
  /**
   * Props to pass to the StepTitle component
   */
  titleProps: ComponentProps<typeof StepTitle>;
  /**
   * Props to pass to the RuleInstruction component
   */
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
    <Step
      fullWidth
      announcement={announcement}
    >
      <StepTitle
        wait
        {...titleProps}
      />

      <RuleInstruction {...ruleInstructionProps} />

      <Instruction contained>
        <Flex
          className="div-container"
          wrap="wrap"
          gap={8}
        >
          {sortPlayers(players).map((player) => {
            if (isHost) {
              return (
                <TransparentButton
                  key={`p-bt-${player.id}`}
                  disabled={isLoading}
                  onClick={() => onSubmitPlayer(player.id)}
                >
                  <PlayerAvatarCard
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
              <PlayerAvatarCard
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

      {isHost && (
        <SpaceContainer>
          <SendButton
            size="large"
            type="dashed"
            onClick={() => onSubmitPlayer(sample(Object.keys(players)) ?? shuffle(Object.keys(players))[0])}
            disabled={isLoading}
          >
            <Translate
              pt="Qualquer um"
              en="Any player"
            />
          </SendButton>
        </SpaceContainer>
      )}

      <RuleInstruction type="event">
        <Translate
          pt="O anfitrião selecionará o jogador"
          en="The host will select the player"
        />
      </RuleInstruction>
    </Step>
  );
}
