import { useMemo, useState } from 'react';
// Ant Design Resources
import { Alert, Divider, Flex, Space, Typography } from 'antd';
// Types
import type { GamePlayers, GamePlayer } from 'types/game';
// Hooks
import { useSortedPlayers } from '@hooks/useSortedPlayers';
// Components
import { SendButton } from '@components/buttons/SendButton';
import { Translate } from '@components/language/Translate';
import { RuleInstruction } from '@components/text/RuleInstruction';
// Internal
import type {
  FestaJuninaCard,
  OngoingEffect,
  Play,
  PlaySelections,
  SubmitSelectionsPayload,
} from '../utils/types';
import { PLAYER_STATUS } from '../utils/constants';

type CardEffectSelectionProps = {
  players: GamePlayers;
  play: Play;
  user: GamePlayer;
  cardsSetAside: UID[];
  ongoingEffects: OngoingEffect[];
  cardsDict: Dictionary<FestaJuninaCard>;
  onSubmitSelections: (payload: SubmitSelectionsPayload) => void;
};

export function CardEffectSelection({
  players,
  play,
  user,
  cardsSetAside,
  ongoingEffects,
  cardsDict,
  onSubmitSelections,
}: CardEffectSelectionProps) {
  const availablePlayers = useSortedPlayers(players, {
    filter: (p) => p.id !== user.id && p.status === PLAYER_STATUS.ACTIVE,
  });

  const handleSelectionsSubmit = (selections: PlaySelections) => {
    onSubmitSelections({
      selections: selections,
    });
  };

  const handleSubmitSelectedPlayer = (targetPlayerId: UID) => {
    handleSelectionsSubmit({
      targetPlayerId,
    });
  };

  const [selectedPlayerId, setSelectedPlayerId] = useState<UID | null>(null);

  console.log(availablePlayers);

  if (!play.activeCardId) {
    return null;
  }

  const playedCard = cardsDict[play.activeCardId];
  console.log(playedCard);

  let content = (
    <Alert
      title={
        <Translate
          en="Something went wrong, no effects to resolve."
          pt="Algo deu errado, nenhum efeito para resolver."
        />
      }
      type="error"
    />
  );

  switch (play.effectKeyword) {
    case 'DISCARD_REDRAW':
      content = (
        <RuleInstruction type="event">
          <Typography.Paragraph>{playedCard.effect}</Typography.Paragraph>
          <PlayerTargetOptions
            availablePlayers={availablePlayers}
            onSubmit={handleSubmitSelectedPlayer}
            user={user}
          />
        </RuleInstruction>
      );
      break;
    // case 'GUESS_RANK':
    case 'GUESS_NAME':
      content = (
        <RuleInstruction type="event">
          <Typography.Paragraph>{playedCard.effect}</Typography.Paragraph>
          <PlayerTargetOptions
            availablePlayers={availablePlayers}
            onClick={setSelectedPlayerId}
            selectedPlayerId={selectedPlayerId}
          />
          {selectedPlayerId && (
            <>
              <Divider />
              <CardSelectionOptions
                cardsDict={cardsDict}
                onSubmit={(cardId) =>
                  handleSelectionsSubmit({ targetPlayerId: selectedPlayerId, effectInput: cardId })
                }
                property="name"
              />
            </>
          )}
        </RuleInstruction>
      );
      break;
    // case 'PEEK':
    // case 'SWAP_ASIDE':
    // case 'COMPARE_LOWER':
    // case 'COMPARE_HIGHER':
    // case 'TRADE_HANDS':
    // case 'FORCE_TRADE':
    default:
    // Do nothing;
  }

  return (
    <Flex
      gap={8}
      vertical
      align="center"
    >
      {content}
    </Flex>
  );
}

type PlayerTargetOptionsProps = {
  availablePlayers: GamePlayer[];
  onSubmit?: (targetPlayerId: UID) => void;
  onClick?: (targetPlayerId: UID) => void;
  selectedPlayerId?: UID | null;
  user?: GamePlayer;
};

function PlayerTargetOptions({
  availablePlayers,
  onSubmit,
  onClick,
  selectedPlayerId,
  user,
}: PlayerTargetOptionsProps) {
  const handleClick = onSubmit ?? onClick ?? (() => {});
  return (
    <Flex justify="center">
      <Space
        className="mt-2"
        wrap
      >
        {!!user && (
          <SendButton
            key={user.id}
            onClick={() => handleClick(user.id)}
            type={selectedPlayerId === user.id ? 'primary' : 'default'}
            shape="round"
            icon={!onSubmit ? '' : undefined}
          >
            {user.name}
          </SendButton>
        )}
        {availablePlayers.map((player) => (
          <SendButton
            key={player.id}
            onClick={() => handleClick(player.id)}
            type={selectedPlayerId === player.id ? 'primary' : 'default'}
            shape="round"
            icon={!onSubmit ? '' : undefined}
          >
            {player.name}
          </SendButton>
        ))}
      </Space>
    </Flex>
  );
}

type CardSelectionOptionsProps = {
  cardsDict: Dictionary<FestaJuninaCard>;
  onSubmit: (targetPlayerId: UID) => void;
  property: 'rank' | 'name';
};

function CardSelectionOptions({ cardsDict, onSubmit, property }: CardSelectionOptionsProps) {
  const cards = useMemo(
    () =>
      Object.values(cardsDict)
        .filter((card) => card.count > 0 && card.rank !== 1)
        .map((card) => ({
          id: card.id,
          value: `${card[property]} × ${card.count}`,
        })),
    [cardsDict, property],
  );

  return (
    <Flex justify="center">
      <Space
        className="mt-2"
        wrap
      >
        {cards.map((option) => (
          <SendButton
            key={option.id}
            onClick={() => onSubmit(option.id)}
            type="default"
            shape="round"
          >
            {option.value}
          </SendButton>
        ))}
      </Space>
    </Flex>
  );
}
