import { useMemo, useState } from 'react';
// Ant Design Resources
import { Flex, InputNumber, Space, Switch, Tooltip } from 'antd';
// Types
import type { GameRound } from 'types/game';
import type { GamePlayers, GamePlayer } from 'types/player';
// Hooks
import { useLoading } from 'hooks/useLoading';
import { useMock } from 'hooks/useMock';
// Utils
import { pluralize, sortPlayers } from 'utils/helpers';
// Icons
import { BombIcon } from 'icons/BombIcon';
import { WireIcon } from 'icons/WireIcon';
// Components
import { PlayerAvatarCard, PlayerAvatarName } from 'components/avatars';
import { IconAvatar } from 'components/avatars/IconAvatar';
import { SendButton } from 'components/buttons';
import { Translate } from 'components/language';
import { Step, type StepProps } from 'components/steps';
import { RuleInstruction, StepTitle } from 'components/text';
// Internal
import type {
  DataCount,
  Status,
  SubmitDeclarationPayload,
  SubmitTargetPayload,
  UpdateTargetPlayerPayload,
} from './utils/types';
import { mockDeclaration } from './utils/mock';
import { RoleCard } from './components/RoleCard';
import { Tips } from './components/RulesBlobs';
import { Hand } from './components/Hand';
import { BombHighlight, RedWireHighlight } from './components/Highlights';
import { PlayerTableEntry } from './components/PlayerTableEntry';
import { HandTarget } from './components/HandTarget';

type StepDeclarationProps = {
  players: GamePlayers;
  user: GamePlayer;
  dataCount: DataCount;
  status: Status;
  // nextInvestigator: GamePlayer;
  // isTheNextInvestigator: boolean;
  round: GameRound;
  currentTargetPlayerId?: PlayerId;
  currentInvestigator: GamePlayer;
  isTheCurrentInvestigator: boolean;
  onUpdateTargetPlayerId: (payload: UpdateTargetPlayerPayload) => void;
  onTargetCard: (payload: SubmitTargetPayload) => void;
} & Pick<StepProps, 'announcement'>;

export function StepExamine({
  announcement,
  user,
  players,
  dataCount,
  // nextInvestigator,
  onUpdateTargetPlayerId,
  onTargetCard,
  isTheCurrentInvestigator,
  status,
  currentTargetPlayerId,
  currentInvestigator,
}: StepDeclarationProps) {
  const { isLoading } = useLoading();

  const neededWires = dataCount.wires - (status.revealed ?? 0);

  const playersList = useMemo(() => sortPlayers(players), [players]);
  const targetPlayer = currentTargetPlayerId ? players[currentTargetPlayerId] : null;

  return (
    <Step
      fullWidth
      announcement={announcement}
    >
      <StepTitle>
        {targetPlayer ? (
          <Translate
            pt={
              <>
                <PlayerAvatarName player={currentInvestigator} />, escolha uma das cartas de{' '}
                <PlayerAvatarName player={targetPlayer} />
              </>
            }
            en={
              <>
                <PlayerAvatarName player={currentInvestigator} />, choose one of{' '}
                <PlayerAvatarName player={targetPlayer} />
                's cards.
              </>
            }
          />
        ) : (
          <Translate
            pt={
              <>
                <PlayerAvatarName player={currentInvestigator} />, escolha um jogador para examinar uma de
                suas cartas.
              </>
            }
            en={
              <>
                <PlayerAvatarName player={currentInvestigator} />, choose a player to examine one of their
                cards.
              </>
            }
          />
        )}
      </StepTitle>

      <RuleInstruction type="action">
        <Translate
          pt={
            <>
              Se você é um agente, você quer descobrir onde estão os{' '}
              <RedWireHighlight>{neededWires} fios vermelhos</RedWireHighlight> para desarmar a bomba!
              <br />
              Se você é um terrorista, você quer enganar os agentes para que eles revelem a bomba ou não
              encontrar os fios vermelhos até o jogo acabar.
            </>
          }
          en={
            <>
              If you are an agent, you want to find out where the{' '}
              <RedWireHighlight>{neededWires} red wires</RedWireHighlight> are to defuse the bomb!
              <br />
              If you are a terrorist, you want to mislead the agents so they reveal the bomb or fail to find
              the red wires until the game ends.
            </>
          }
        />
      </RuleInstruction>

      <Flex
        gap={6}
        className="mb-4"
      >
        {playersList.map((player) => (
          <PlayerTableEntry
            key={player.id}
            player={player}
            currentTargetPlayerId={currentTargetPlayerId}
            onSelect={
              isTheCurrentInvestigator
                ? () => onUpdateTargetPlayerId({ targetPlayerId: player.id })
                : undefined
            }
          />
        ))}
      </Flex>

      {targetPlayer && <HandTarget hand={targetPlayer.hand} />}

      {/* <RoleCard
        role={user?.role}
        dataCount={dataCount}
      />
      <Hand
        hand={user.hand}
        dataCount={dataCount}
      /> */}
      <Tips />
    </Step>
  );
}
