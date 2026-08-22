import { sortBy } from 'lodash';
// Ant Design Resources
import { Flex } from 'antd';
// Types
import type { GameRound, GamePlayers, GamePlayer } from 'types/game';
// Hooks
import { useMock } from '@hooks/useMock';
import { useSortedPlayers } from '@hooks/useSortedPlayers';
// Utils
import { getAvatarColorById } from '@utils/helpers';
// Components
import { HostNextPhaseButton } from '@components/host/HostNextPhaseButton';
import { ImageCard } from '@components/image-cards/ImageCard';
import { Translate } from '@components/language/Translate';
import { PlayerAvatarName } from '@components/player/PlayerAvatarName';
import { Step, type StepProps } from '@components/steps/Step';
import { RuleInstruction } from '@components/text/RuleInstruction';
import { StepTitle } from '@components/text/StepTitle';
import { TextHighlight } from '@components/text/TextHighlight';
// Internal
import type {
  DataCounts,
  LieDetectorStatus,
  Status,
  SubmitTargetPayload,
  UpdateTargetPlayerPayload,
} from './utils/types';
import { CARD_IMAGE_NAMES, OUTCOME } from './utils/constants';
import { mockTargetPlayerForExamination } from './utils/mock';
import { RoleCard } from './components/RoleCard';
import { Tips } from './components/RulesBlobs';
import { RedWireHighlight } from './components/Highlights';
import { PlayerTableEntry } from './components/PlayerTableEntry';
import { HandTarget } from './components/HandTarget';

type StepDeclarationProps = {
  players: GamePlayers;
  user: GamePlayer;
  dataCounts: DataCounts;
  status: Status;
  round: GameRound;
  currentTargetPlayerId?: UID;
  currentInvestigator: GamePlayer;
  isTheCurrentInvestigator: boolean;
  onUpdateTargetPlayerId: (payload: UpdateTargetPlayerPayload) => void;
  onTargetCard: (payload: SubmitTargetPayload) => void;
  lieDetectorStatus: LieDetectorStatus;
} & Pick<StepProps, 'announcement'>;

export function StepExamine({
  announcement,
  user,
  players,
  dataCounts,
  onUpdateTargetPlayerId,
  onTargetCard,
  isTheCurrentInvestigator,
  status,
  currentTargetPlayerId,
  currentInvestigator,
  round,
  lieDetectorStatus,
}: StepDeclarationProps) {
  const sortedPlayers = useSortedPlayers(players);

  const neededWires = dataCounts.wires - (status.revealed ?? 0);
  const roundCuts = sortBy(Object.keys(status.cut)).map((key) => status.cut[key]);
  const targetPlayer = currentTargetPlayerId ? players[currentTargetPlayerId] : null;

  useMock(() => {
    if (isTheCurrentInvestigator && !currentTargetPlayerId && status.outcome === OUTCOME.CONTINUE) {
      const mockTargetPlayerId = mockTargetPlayerForExamination(
        user.id,
        user.role,
        dataCounts,
        status,
        players,
        round,
      );
      onUpdateTargetPlayerId({ targetPlayerId: mockTargetPlayerId });
    }
  });

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
          en="If you are an agent, you want to find out where the <redWiresNeeded>red wires</redWiresNeeded> are to defuse the bomb!
          <br/>
          If you are a terrorist, you want to mislead the agents so they reveal the bomb or fail to find the red wires until the game ends."
          pt="Se você é um agente, você quer descobrir onde estão os <redWiresNeeded>fios vermelhos</redWiresNeeded> para desarmar a bomba!
          <br/>
          Se você é um terrorista, você quer enganar os agentes para que eles revelem a bomba ou não encontrem os fios vermelhos até o jogo acabar."
          values={{
            redWiresNeeded: (text) => (
              <RedWireHighlight>
                {neededWires} {text}
              </RedWireHighlight>
            ),
          }}
        />

        {lieDetectorStatus.someoneIsLying && (
          <>
            <br />
            <Translate
              en="Someone is lying this round! When we started, there were {neededWires} red wires and {totalWiresDeclared} were declared."
              pt="Alguém está mentindo nessa rodada! Quando começamos, faltavam {neededWires} fios vermelhos e {totalWiresDeclared} foram declarados."
              values={{
                neededWires: lieDetectorStatus.neededWires,
                totalWiresDeclared: lieDetectorStatus.totalWiresDeclared,
              }}
            />
          </>
        )}

        {roundCuts.length > 0 && (
          <>
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
          </>
        )}
      </RuleInstruction>

      <Flex
        gap={6}
        className="mb-4"
      >
        {sortedPlayers.map((player) => (
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

      {isTheCurrentInvestigator &&
        targetPlayer &&
        status.outcome === OUTCOME.CONTINUE &&
        targetPlayer.hand.length > 0 && (
          <MockAutoTargetCardSelection
            key={targetPlayer.id}
            targetPlayer={targetPlayer}
            status={status}
            onTargetCard={onTargetCard}
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

type MockAutoTargetCardSelectionProps = {
  targetPlayer: GamePlayer;
  status: Status;
  onTargetCard: (payload: SubmitTargetPayload) => void;
};

function MockAutoTargetCardSelection({
  targetPlayer,
  status,
  onTargetCard,
}: MockAutoTargetCardSelectionProps) {
  useMock(() => {
    const randomCardIndex = Math.floor(Math.random() * targetPlayer.hand.length);
    const randomCard = targetPlayer.hand[randomCardIndex];
    const activePlayerIdsArray = sortBy(Object.keys(status.activePlayerIds)).map(
      (key) => status.activePlayerIds[key],
    );
    const playerIndex = activePlayerIdsArray.indexOf(null);

    if (playerIndex === -1) {
      return;
    }

    onTargetCard({
      target: {
        playerId: targetPlayer.id,
        playerIndex,
        targetCard: randomCard,
        targetCardIndex: Object.keys(status.cut).length,
      },
    });
  });

  return null;
}

function getTitle(
  outcome: (typeof OUTCOME)[keyof typeof OUTCOME],
  currentInvestigator: GamePlayer,
  targetPlayer: GamePlayer | null,
) {
  if (outcome === OUTCOME.END) {
    return (
      <Translate
        pt="Todas as cartas para a rodada foram examinadas."
        en="All cards for the round have been examined."
      />
    );
  }

  if (targetPlayer) {
    return (
      <Translate
        en="{currentInvestigador}, choose one of {targetPlayer}'s cards to examine."
        pt="{currentInvestigador}, escolha uma das cartas de {targetPlayer} para examinar. "
        values={{
          currentInvestigador: <PlayerAvatarName player={currentInvestigator} />,
          targetPlayer: (
            <TextHighlight>
              <PlayerAvatarName player={targetPlayer} />
            </TextHighlight>
          ),
        }}
      />
    );
  }

  return (
    <Translate
      en="{currentInvestigator}, choose a player to examine one of their cards."
      pt="{currentInvestigator}, escolha um jogador para examinar uma de suas cartas."
      values={{
        currentInvestigator: <PlayerAvatarName player={currentInvestigator} />,
      }}
    />
  );
}
