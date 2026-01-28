import { sortBy } from 'lodash';
import { useMemo } from 'react';
// Ant Design Resources
import { Flex } from 'antd';
// Types
import type { GameRound } from 'types/game';
import type { GamePlayers, GamePlayer } from 'types/player';
// Utils
import { getAvatarColorById, sortPlayers } from 'utils/helpers';
// Components
import { PlayerAvatarName } from 'components/avatars';
import { HostNextPhaseButton } from 'components/host';
import { ImageCard } from 'components/image-cards';
import { Translate } from 'components/language';
import { Step, type StepProps } from 'components/steps';
import { RuleInstruction, StepTitle, TextHighlight } from 'components/text';
// Internal
import type { DataCounts, Status, SubmitTargetPayload, UpdateTargetPlayerPayload } from './utils/types';
import { CARD_IMAGE_NAMES, OUTCOME } from './utils/constants';
import { RoleCard } from './components/RoleCard';
import { Tips } from './components/RulesBlobs';
import { RedWireHighlight } from './components/Highlights';
import { PlayerTableEntry } from './components/PlayerTableEntry';
import { HandTarget } from './components/HandTarget';
// Hooks
// Icons

type StepDeclarationProps = {
  players: GamePlayers;
  user: GamePlayer;
  dataCounts: DataCounts;
  status: Status;
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
  dataCounts,
  // nextInvestigator,
  onUpdateTargetPlayerId,
  onTargetCard,
  isTheCurrentInvestigator,
  status,
  currentTargetPlayerId,
  currentInvestigator,
  round,
}: StepDeclarationProps) {
  const neededWires = dataCounts.wires - (status.revealed ?? 0);

  const roundCuts = sortBy(Object.keys(status.cut)).map((key) => status.cut[key]);

  const playersList = useMemo(() => sortPlayers(players), [players]);
  const targetPlayer = currentTargetPlayerId ? players[currentTargetPlayerId] : null;

  return (
    <Step
      fullWidth
      announcement={announcement}
    >
      <StepTitle>{getTitle(status.outcome, currentInvestigator, targetPlayer)}</StepTitle>

      {status.outcome === OUTCOME.END && (
        <HostNextPhaseButton
          withWaitingTimeBar
          round={round}
          autoTriggerTime={10}
        />
      )}

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
        <br />
        <Flex
          justify="center"
          align="center"
        >
          {roundCuts.map((card) => {
            return (
              <ImageCard
                key={card.id}
                cardWidth={32}
                cardId={CARD_IMAGE_NAMES[card.type]}
                preview={false}
                className="examined-mini-card"
              />
            );
          })}{' '}
          <strong>/ {dataCounts.wires}</strong>
        </Flex>
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
            disabled={player.id === user.id}
            onSelect={
              isTheCurrentInvestigator && status.outcome === OUTCOME.CONTINUE
                ? () => onUpdateTargetPlayerId({ targetPlayerId: player.id })
                : undefined
            }
          />
        ))}
      </Flex>

      {targetPlayer && (
        <HandTarget
          hand={targetPlayer.hand}
          activeColor={getAvatarColorById(targetPlayer.avatarId)}
          onSelectCard={
            isTheCurrentInvestigator
              ? (card) => {
                  const activePlayerIdsArray = sortBy(Object.keys(status.activePlayerIds)).map(
                    (key) => status.activePlayerIds[key],
                  );
                  onTargetCard({
                    target: {
                      playerId: targetPlayer.id,
                      playerIndex: activePlayerIdsArray.indexOf(null),
                      targetCard: card,
                      targetCardIndex: Object.keys(status.cut).length,
                    },
                  });
                }
              : undefined
          }
        />
      )}

      <Tips>
        <RoleCard
          role={user?.role}
          dataCounts={dataCounts}
        />
      </Tips>
    </Step>
  );
}

function getTitle(
  outcome: (typeof OUTCOME)[keyof typeof OUTCOME],
  currentInvestigator: GamePlayer,
  targetPlayer: GamePlayer | null,
) {
  if (outcome === OUTCOME.END) {
    return (
      <Translate
        pt={<>Todas as cartas para a rodada foram examinadas.</>}
        en={<>All cards for the round have been examined.</>}
      />
    );
  }

  if (targetPlayer) {
    return (
      <Translate
        pt={
          <>
            <PlayerAvatarName player={currentInvestigator} />, escolha uma das cartas de{' '}
            <TextHighlight>
              <PlayerAvatarName player={targetPlayer} />
            </TextHighlight>
          </>
        }
        en={
          <>
            <PlayerAvatarName player={currentInvestigator} />, choose one of{' '}
            <TextHighlight>
              <PlayerAvatarName player={targetPlayer} />
            </TextHighlight>
            's cards.
          </>
        }
      />
    );
  }

  return (
    <Translate
      pt={
        <>
          <PlayerAvatarName player={currentInvestigator} />, escolha um jogador para examinar uma de suas
          cartas.
        </>
      }
      en={
        <>
          <PlayerAvatarName player={currentInvestigator} />, choose a player to examine one of their cards.
        </>
      }
    />
  );
}
