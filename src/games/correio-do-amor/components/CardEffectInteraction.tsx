import { type ReactNode, useMemo, useState } from 'react';
// Ant Design Resources
import { Alert, Divider, Flex, Space, Tag, Typography } from 'antd';
// Types
import type { GamePlayers, GamePlayer } from 'types/game';
// Hooks
import { useSortedPlayers } from '@hooks/useSortedPlayers';
// Components
import { SendButton } from '@components/buttons/SendButton';
import { TimedButton } from '@components/buttons/TimedButton';
import { Translate } from '@components/language/Translate';
import { RuleInstruction } from '@components/text/RuleInstruction';
// Internal
import type { FestaJuninaCard, Play, PlaySelections, SubmitSelectionsPayload } from '../utils/types';
import { KEYWORDS, PLAYER_STATUS, RESOLUTION_KEYWORD } from '../utils/constants';
import { useCustomCardWidth } from '../utils/useCustomCardWidth';
import { getCardKeyFromId } from '../utils/helpers';
import { PlayedCardAnimation } from './PlayedCardAnimation';
import { FestaJuninaCardImage } from './FestaJuninaCardImage';

type CardEffectInteractionProps = {
  players: GamePlayers;
  play: Play;
  user: GamePlayer;
  cardsSetAside: UID[];
  cardsDict: Dictionary<FestaJuninaCard>;
  onSubmitSelections: (payload: SubmitSelectionsPayload) => void;
};

export function CardEffectInteraction({
  players,
  play,
  user,
  cardsSetAside,
  cardsDict,
  onSubmitSelections,
}: CardEffectInteractionProps) {
  const { passiveCardWidth } = useCustomCardWidth();

  const availablePlayers = useSortedPlayers(players, {
    filter: (p) => p.id !== user.id && p.status === PLAYER_STATUS.ACTIVE,
  });
  const cardInHand = cardsDict?.[getCardKeyFromId(user.hand?.[0] ?? '')];

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

  if (!play.cardKey) {
    return null;
  }

  const playedCard = cardsDict[play.cardKey];

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

  switch (play.cardKeyword) {
    // RANK 1
    case KEYWORDS.GUESS_RANK:
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
                property="rank"
              />
            </>
          )}
          {availablePlayers.length === 0 && (
            <NoAvailableTarget handleSelectionsSubmit={handleSelectionsSubmit} />
          )}
        </RuleInstruction>
      );
      break;
    case KEYWORDS.GUESS_NAME:
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
          {availablePlayers.length === 0 && (
            <NoAvailableTarget handleSelectionsSubmit={handleSelectionsSubmit} />
          )}
        </RuleInstruction>
      );
      break;

    // RANK 2
    case KEYWORDS.PEEK:
      {
        const selectedCard = selectedPlayerId
          ? cardsDict[getCardKeyFromId(players[selectedPlayerId].hand?.[0] ?? '')]
          : null;

        content = (
          <RuleInstruction type="event">
            <Typography.Paragraph>{playedCard.effect}</Typography.Paragraph>
            <PlayerTargetOptions
              availablePlayers={availablePlayers}
              onClick={setSelectedPlayerId}
              selectedPlayerId={selectedPlayerId}
              disabled={!!selectedPlayerId}
            />
            {selectedPlayerId && selectedCard && (
              <>
                <Divider />

                <Flex
                  vertical
                  align="center"
                  gap={8}
                >
                  <Translate
                    en="The card of player {playerName} is:"
                    pt="A carta do jogador {playerName} é:"
                    values={{ playerName: players[selectedPlayerId]?.name ?? 'Unknown' }}
                  />
                  <FestaJuninaCardImage
                    card={selectedCard}
                    cardId={selectedCard.id}
                    width={passiveCardWidth}
                  />

                  <TimedButton
                    onExpire={() => {
                      handleSelectionsSubmit({ targetPlayerId: selectedPlayerId });
                    }}
                    duration={15}
                  >
                    <Translate
                      en="Done"
                      pt="Pronto"
                    />
                  </TimedButton>
                </Flex>
              </>
            )}
            {availablePlayers.length === 0 && (
              <NoAvailableTarget handleSelectionsSubmit={handleSelectionsSubmit} />
            )}
          </RuleInstruction>
        );
      }
      break;
    case KEYWORDS.PEEK_ASIDE:
      content = (
        <RuleInstruction type="event">
          <Typography.Paragraph>{playedCard.effect}</Typography.Paragraph>
          {cardsSetAside.map((cardId) => {
            const card = cardsDict[getCardKeyFromId(cardId)];
            if (!card) {
              return null;
            }
            return (
              <Flex
                key={card.id}
                vertical
                gap={8}
                align="center"
              >
                <FestaJuninaCardImage
                  key={card.id}
                  cardId={card.id}
                  card={card}
                  width={passiveCardWidth}
                />
              </Flex>
            );
          })}

          <Flex justify="center">
            <TimedButton
              onExpire={() => {
                handleSelectionsSubmit({ targetPlayerId: selectedPlayerId });
              }}
              duration={15}
            >
              <Translate
                en="Done"
                pt="Pronto"
              />
            </TimedButton>
          </Flex>
        </RuleInstruction>
      );
      break;

    // RANK 3
    case KEYWORDS.COMPARE_HIGHER:
    case KEYWORDS.COMPARE_LOWER:
      content = (
        <PlayAreaWithCard playedCard={playedCard}>
          <Typography.Paragraph>{playedCard.effect}</Typography.Paragraph>
          {cardInHand && (
            <Typography.Paragraph>
              <Translate
                pt="Lembre-se que a comparação é feita com a carta em mãos ({card} #{rank})."
                en="Remember that the comparison is made with the card in hand ({card} #{rank}), so choose carefully!"
                values={{ card: cardInHand.name, rank: cardInHand.rank }}
              />
            </Typography.Paragraph>
          )}
          <PlayerTargetOptions
            availablePlayers={availablePlayers}
            onSubmit={handleSubmitSelectedPlayer}
          />
          {availablePlayers.length === 0 && (
            <NoAvailableTarget handleSelectionsSubmit={handleSelectionsSubmit} />
          )}
        </PlayAreaWithCard>
      );
      break;

    // RANK 5
    case KEYWORDS.DISCARD_REDRAW:
      content = (
        <PlayAreaWithCard playedCard={playedCard}>
          <Typography.Paragraph>{playedCard.effect}</Typography.Paragraph>
          <PlayerTargetOptions
            availablePlayers={availablePlayers}
            onSubmit={handleSubmitSelectedPlayer}
            user={user}
          />
        </PlayAreaWithCard>
      );
      break;

    // RANK 6
    case KEYWORDS.TRADE_HANDS:
      content = (
        <PlayAreaWithCard playedCard={playedCard}>
          <Typography.Paragraph>{playedCard.effect}</Typography.Paragraph>
          <PlayerTargetOptions
            availablePlayers={availablePlayers}
            onSubmit={handleSubmitSelectedPlayer}
          />
          {availablePlayers.length === 0 && (
            <NoAvailableTarget handleSelectionsSubmit={handleSelectionsSubmit} />
          )}
        </PlayAreaWithCard>
      );
      break;
    case KEYWORDS.FORCE_TRADE:
      content = (
        <PlayAreaWithCard playedCard={playedCard}>
          <Typography.Paragraph>{playedCard.effect}</Typography.Paragraph>
          <PlayerTargetOptions
            availablePlayers={availablePlayers}
            onClick={setSelectedPlayerId}
            selectedPlayerId={selectedPlayerId}
          />
          {availablePlayers.length === 0 && (
            <NoAvailableTarget handleSelectionsSubmit={handleSelectionsSubmit} />
          )}
          {selectedPlayerId && (
            <>
              <Typography.Paragraph style={{ marginBottom: 0 }}>
                <Translate
                  en="Now choose another player to trade hands with:"
                  pt="Agora escolha outro jogador para trocar de mãos:"
                />
              </Typography.Paragraph>
              <PlayerTargetOptions
                availablePlayers={availablePlayers.filter((p) => p.id !== selectedPlayerId)}
                onSubmit={(secondTargetPlayerId) => {
                  handleSelectionsSubmit({
                    targetPlayerId: selectedPlayerId,
                    effectInput: secondTargetPlayerId,
                  });
                }}
              />
            </>
          )}
        </PlayAreaWithCard>
      );
      break;
    case KEYWORDS.TRADE_ASIDE:
      content = (
        <PlayAreaWithCard playedCard={playedCard}>
          <Typography.Paragraph>{playedCard.effect}</Typography.Paragraph>

          {cardsSetAside.length > 0 ? (
            <Flex
              justify="center"
              gap={16}
            >
              {cardsSetAside.map((cardId) => {
                const card = cardsDict[getCardKeyFromId(cardId)];
                if (!card) {
                  return null;
                }
                return (
                  <Flex
                    key={card.id}
                    vertical
                    gap={8}
                    align="center"
                  >
                    <FestaJuninaCardImage
                      key={card.id}
                      cardId={card.id}
                      card={card}
                      width={passiveCardWidth}
                    />
                    <SendButton
                      onClick={() => {
                        handleSelectionsSubmit({
                          effectInput: cardId,
                        });
                      }}
                    >
                      <Translate
                        en="Trade"
                        pt="Trocar"
                      />
                    </SendButton>
                  </Flex>
                );
              })}
            </Flex>
          ) : (
            <Translate
              en="No aside cards available."
              pt="Não há cartas à parte disponíveis."
            />
          )}
        </PlayAreaWithCard>
      );
      break;

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
  disabled?: boolean;
};

function PlayerTargetOptions({
  availablePlayers,
  onSubmit,
  onClick,
  selectedPlayerId,
  user,
  disabled,
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
            disabled={disabled}
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
            disabled={disabled}
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
          value: (
            <span>
              {property === 'name' && <Tag>{card.rank}</Tag>} "{card[property]}"{' '}
              <span style={{ fontSize: '0.8em' }}>(×{card.count})</span>
            </span>
          ),
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

type PlayAreaWithCardProps = {
  playedCard: FestaJuninaCard;
  children: ReactNode;
};

function PlayAreaWithCard({ playedCard, children }: PlayAreaWithCardProps) {
  const { passiveCardWidth } = useCustomCardWidth();

  return (
    <div className="card-interaction-area">
      <PlayedCardAnimation
        playedCard={playedCard}
        cardWidth={passiveCardWidth}
        animation={false}
      />
      <RuleInstruction
        type="event"
        style={{ minWidth: 256, minHeight: passiveCardWidth * 1.5 }}
      >
        {children}
      </RuleInstruction>
    </div>
  );
}

type NoAvailableTargetProps = {
  handleSelectionsSubmit: (selections: PlaySelections) => void;
};

function NoAvailableTarget({ handleSelectionsSubmit }: NoAvailableTargetProps) {
  return (
    <Typography.Paragraph>
      <Translate
        en="No available players to target."
        pt="Não há jogadores disponíveis para escolher."
      />
      <br />
      <SendButton
        onClick={() => handleSelectionsSubmit({ effectInput: RESOLUTION_KEYWORD.NO_TARGET_AVAILABLE })}
      >
        <Translate
          en="Skip Turn"
          pt="Pular Vez"
        />
      </SendButton>
    </Typography.Paragraph>
  );
}
