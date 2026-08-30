import type { ReactNode } from 'react';
// Ant Design Resources
import { Alert } from 'antd';
// Types
import type { GamePlayers, GamePlayer } from 'types/game';
// Components
import { Translate } from '@components/language/Translate';
import { PlayerAvatarName } from '@components/player/PlayerAvatarName';
import { RuleInstruction } from '@components/text/RuleInstruction';
// Internal
import type { FestaJuninaCard, LogEntry } from '../utils/types';
import { useCustomCardWidth } from '../utils/useCustomCardWidth';
import { getCardKeyFromId } from '../utils/helpers';
import { KEYWORDS, RESOLUTION_KEYWORD } from '../utils/constants';
import { EliminatedHighlight, PlayedCardHighlight, TargetHighlight } from './Highlights';
import { PlayedCardAnimation } from './PlayedCardAnimation';

type CardResolutionAnimationProps = {
  players: GamePlayers;
  activePlayer: GamePlayer;
  cardsDict: Dictionary<FestaJuninaCard>;
  logEntry: LogEntry;
};

export function CardResolutionAnimation({
  players,
  activePlayer,
  cardsDict,
  logEntry,
}: CardResolutionAnimationProps) {
  const playedCard = cardsDict[logEntry.cardKey ?? ''] ?? null;
  const targets = logEntry.targetPlayersIds.map((id) => players[id]);
  const eliminatedPlayers = logEntry.eliminatedPlayersIds.map((id) => players[id]);

  const everyPrefix = (
    <Translate
      en="{player} played {card}"
      pt="{player} jogou {card}"
      values={{
        player: <PlayerAvatarName player={activePlayer} />,
        card: (
          <PlayedCardHighlight
            card={playedCard}
            showRank
          />
        ),
      }}
    />
  );

  if (logEntry.resolutionKeyword === RESOLUTION_KEYWORD.NO_TARGET_AVAILABLE) {
    return (
      <PlayAreaWithCard playedCard={playedCard}>
        {everyPrefix}
        <Translate
          en=", but there were no available players to target."
          pt=", mas não havia jogadores disponíveis para escolher."
        />
      </PlayAreaWithCard>
    );
  }

  switch (logEntry.cardKeyword) {
    // RANK 0
    case KEYWORDS.COUNTER_ATTACK:
    case KEYWORDS.SURVIVE_SOLO:
    case KEYWORDS.AUTO_WIN_COMPARE:
    case KEYWORDS.GAIN_POINT_ON_ELIMINATION:
      return (
        <PlayAreaWithCard playedCard={playedCard}>
          {everyPrefix}
          <Translate
            en=" and nothing happens. This card only has a passive effect if it had stayed in your hand."
            pt=" e nada acontece. Esta carta só tem um efeito passivo se tivesse ficado na sua mão."
          />
        </PlayAreaWithCard>
      );

    // RANK 1
    case KEYWORDS.GUESS_RANK: {
      const guessCard = cardsDict[logEntry.effectInput ?? ''];
      return (
        <PlayAreaWithCard playedCard={playedCard}>
          {everyPrefix}
          <Translate
            en=" and chose {target} to guess their card rank."
            pt=" e escolheu {target} para adivinhar o valor da carta na mão dele."
            values={{
              target: (
                <TargetHighlight>
                  <PlayerAvatarName player={targets[0]} />
                </TargetHighlight>
              ),
            }}
          />
          <br />
          <br />
          {logEntry.resolutionKeyword !== RESOLUTION_KEYWORD.COUNTER_ATTACK &&
            eliminatedPlayers.length > 0 && (
              <Translate
                en="They guessed {guessCard} and were correct! {eliminatedPlayer} is eliminated."
                pt="Tentou adivinhar {guessCard} e acertou! {eliminatedPlayer} foi eliminado(a)."
                values={{
                  guessCard: guessCard ? (
                    <PlayedCardHighlight card={guessCard}>{guessCard.rank}</PlayedCardHighlight>
                  ) : (
                    '?'
                  ),
                  eliminatedPlayer: (
                    <EliminatedHighlight type="negative">
                      <PlayerAvatarName player={eliminatedPlayers[0]} />
                    </EliminatedHighlight>
                  ),
                }}
              />
            )}

          {logEntry.resolutionKeyword !== RESOLUTION_KEYWORD.COUNTER_ATTACK &&
            eliminatedPlayers.length === 0 && (
              <Translate
                en="They guessed {guessCard} and it got it wrong. Life goes on..."
                pt="Chutou {guessCard} e errou. A vida continua..."
                values={{
                  guessCard: guessCard ? (
                    <PlayedCardHighlight card={guessCard}>{guessCard.rank}</PlayedCardHighlight>
                  ) : (
                    '?'
                  ),
                }}
              />
            )}

          {logEntry.resolutionKeyword === RESOLUTION_KEYWORD.COUNTER_ATTACK && (
            <Translate
              en="They guessed {guessCard} and it got it wrong. {target} counter-attacked with {targetCard} and eliminated them!"
              pt="Chutou {guessCard} e errou. {target} contra-atacou com o {targetCard} e eliminou ele!"
              values={{
                guessCard: guessCard ? (
                  <PlayedCardHighlight card={guessCard}>{guessCard.rank}</PlayedCardHighlight>
                ) : (
                  '?'
                ),
                target: (
                  <TargetHighlight>
                    <PlayerAvatarName player={targets[0]} />
                  </TargetHighlight>
                ),
                targetCard: <PlayedCardHighlight card={cardsDict['0_SANFONEIRO']} />,
                eliminatedPlayer: (
                  <EliminatedHighlight type="negative">
                    <PlayerAvatarName player={eliminatedPlayers[0]} />
                  </EliminatedHighlight>
                ),
              }}
            />
          )}
        </PlayAreaWithCard>
      );
    }
    case KEYWORDS.GUESS_NAME: {
      const guessCard = cardsDict[logEntry.effectInput ?? ''];
      return (
        <PlayAreaWithCard playedCard={playedCard}>
          {everyPrefix}
          <Translate
            en=" and chose {target} to guess their card rank."
            pt=" e escolheu {target} para adivinhar o valor da carta na mão dele."
            values={{
              target: (
                <TargetHighlight>
                  <PlayerAvatarName player={targets[0]} />
                </TargetHighlight>
              ),
            }}
          />
          <br />
          <br />
          {logEntry.resolutionKeyword !== RESOLUTION_KEYWORD.COUNTER_ATTACK &&
            eliminatedPlayers.length > 0 && (
              <Translate
                en="They guessed {guessCard} and were correct! {eliminatedPlayer} is eliminated."
                pt="Tentou adivinhar {guessCard} e acertou! {eliminatedPlayer} foi eliminado(a)."
                values={{
                  guessCard: guessCard ? <PlayedCardHighlight card={guessCard} /> : '?',
                  eliminatedPlayer: (
                    <EliminatedHighlight type="negative">
                      <PlayerAvatarName player={eliminatedPlayers[0]} />
                    </EliminatedHighlight>
                  ),
                }}
              />
            )}

          {logEntry.resolutionKeyword !== RESOLUTION_KEYWORD.COUNTER_ATTACK &&
            eliminatedPlayers.length === 0 && (
              <Translate
                en="They guessed {guessCard} and it got it wrong. Life goes on..."
                pt="Chutou {guessCard} e errou. A vida continua..."
                values={{
                  guessCard: guessCard ? <PlayedCardHighlight card={guessCard} /> : '?',
                }}
              />
            )}

          {logEntry.resolutionKeyword === RESOLUTION_KEYWORD.COUNTER_ATTACK && (
            <Translate
              en="They guessed {guessCard} and it got it wrong. {target} counter-attacked with {targetCard} and eliminated them!"
              pt="Chutou {guessCard} e errou. {target} contra-atacou com o {targetCard} e eliminou ele!"
              values={{
                guessCard: guessCard ? (
                  <PlayedCardHighlight card={guessCard}>{guessCard.rank}</PlayedCardHighlight>
                ) : (
                  '?'
                ),
                target: (
                  <TargetHighlight>
                    <PlayerAvatarName player={targets[0]} />
                  </TargetHighlight>
                ),
                targetCard: <PlayedCardHighlight card={cardsDict['0_SANFONEIRO']} />,
                eliminatedPlayer: (
                  <EliminatedHighlight type="negative">
                    <PlayerAvatarName player={eliminatedPlayers[0]} />
                  </EliminatedHighlight>
                ),
              }}
            />
          )}
        </PlayAreaWithCard>
      );
    }

    // RANK 2
    case KEYWORDS.PEEK:
      return (
        <PlayAreaWithCard playedCard={playedCard}>
          {everyPrefix}
          <Translate
            en=" and decided to peek at {target}'s hand."
            pt=" e decidiu espiar a carta de {target}."
            values={{
              target: (
                <TargetHighlight>
                  <PlayerAvatarName player={targets[0]} />
                </TargetHighlight>
              ),
            }}
          />
        </PlayAreaWithCard>
      );
    case KEYWORDS.PEEK_ASIDE:
      return (
        <PlayAreaWithCard playedCard={playedCard}>
          {everyPrefix}
          <Translate
            en=" and peeked at the aside cards."
            pt=" e espiou as cartas separadas no início da rodada."
          />
        </PlayAreaWithCard>
      );

    // RANK 3
    case KEYWORDS.COMPARE_LOWER: {
      const discardedCard = cardsDict[getCardKeyFromId(logEntry.discardedCardId ?? '')];
      return (
        <PlayAreaWithCard playedCard={playedCard}>
          {everyPrefix}
          <Translate
            en=" and chose {target} to compare hands"
            pt=" e escolheu {target} para comparar as mãos."
            values={{
              target: (
                <TargetHighlight>
                  <PlayerAvatarName player={targets[0]} />
                </TargetHighlight>
              ),
            }}
          />
          <br />
          <br />
          {eliminatedPlayers.length > 0 && (
            <Translate
              en="{eliminatedPlayer} had {discardedCard} that was the <strong>lower ranked card</strong>, so they were eliminated!"
              pt="{eliminatedPlayer} tinha {discardedCard} que era a carta de <strong>menor valor</strong>, então foi eliminado(a)!"
              values={{
                discardedCard: discardedCard ? (
                  <PlayedCardHighlight
                    card={discardedCard}
                    showRank
                  />
                ) : (
                  '?'
                ),
                eliminatedPlayer: (
                  <EliminatedHighlight type="negative">
                    <PlayerAvatarName player={eliminatedPlayers[0]} />
                  </EliminatedHighlight>
                ),
              }}
            />
          )}

          {eliminatedPlayers.length === 0 && (
            <Translate
              en="The players compared hands and no one was eliminated. Same rank cards?"
              pt="Os jogadores compararam as mãos e ninguém foi eliminado. Cartas de mesmo valor?"
            />
          )}
        </PlayAreaWithCard>
      );
    }
    case KEYWORDS.COMPARE_HIGHER: {
      const discardedCard = cardsDict[getCardKeyFromId(logEntry.discardedCardId ?? '')];
      return (
        <PlayAreaWithCard playedCard={playedCard}>
          {everyPrefix}
          <Translate
            en=" and chose {target} to compare hands"
            pt=" e escolheu {target} para comparar as mãos."
            values={{
              target: (
                <TargetHighlight>
                  <PlayerAvatarName player={targets[0]} />
                </TargetHighlight>
              ),
            }}
          />
          <br />
          <br />
          {eliminatedPlayers.length > 0 && (
            <Translate
              en="{eliminatedPlayer} had {discardedCard} that was the <strong>higher ranked card</strong>, so they were eliminated!"
              pt="{eliminatedPlayer} tinha {discardedCard} que era a carta de <strong>maior valor</strong>, então foi eliminado(a)!"
              values={{
                discardedCard: discardedCard ? (
                  <PlayedCardHighlight
                    card={discardedCard}
                    showRank
                  />
                ) : (
                  '?'
                ),
                eliminatedPlayer: (
                  <EliminatedHighlight type="negative">
                    <PlayerAvatarName player={eliminatedPlayers[0]} />
                  </EliminatedHighlight>
                ),
              }}
            />
          )}

          {eliminatedPlayers.length === 0 && (
            <Translate
              en="The players compared hands and no one was eliminated. Same rank cards?"
              pt="Os jogadores compararam as mãos e ninguém foi eliminado. Cartas de mesmo valor?"
            />
          )}
        </PlayAreaWithCard>
      );
    }

    // RANK 4
    case KEYWORDS.IMMUNITY:
    case KEYWORDS.IMMUNITY_BONUS:
      return (
        <PlayAreaWithCard playedCard={playedCard}>
          {everyPrefix}
          <Translate
            en=" and is now <strong>immune to all effects</strong> until their next turn."
            pt=" e agora está <strong>imune a todos os efeitos</strong> até a sua próxima vez."
          />
        </PlayAreaWithCard>
      );

    // RANK 5
    case KEYWORDS.DISCARD_REDRAW: {
      const discardedCard = cardsDict[getCardKeyFromId(logEntry.discardedCardId ?? '')];
      return (
        <PlayAreaWithCard playedCard={playedCard}>
          {everyPrefix}
          <Translate
            en=" and chose {target} to discard."
            pt=" e escolheu {target} para descartar."
            values={{
              target: (
                <TargetHighlight>
                  <PlayerAvatarName player={targets[0]} />
                </TargetHighlight>
              ),
            }}
          />
          <br />
          <br />
          {logEntry.resolutionKeyword === RESOLUTION_KEYWORD.DISCARDED_AND_REDRAWN && (
            <Translate
              en="They discarded {discardedCard} and drew a new card."
              pt="O jogador descartou {discardedCard} e comprou uma nova carta."
              values={{
                discardedCard: discardedCard ? <PlayedCardHighlight card={discardedCard} /> : '?',
              }}
            />
          )}
          {logEntry.resolutionKeyword === RESOLUTION_KEYWORD.AUTO_ELIMINATE && (
            <Translate
              en="The player {eliminatedPlayers} was eliminated because it had {card} that can never be discarded."
              pt="O jogador {eliminatedPlayers} foi eliminado porque tinha {card} que nunca pode ser descartado."
              values={{
                eliminatedPlayers: (
                  <EliminatedHighlight type="negative">
                    <PlayerAvatarName player={eliminatedPlayers[0]} />
                  </EliminatedHighlight>
                ),
                card: discardedCard ? <PlayedCardHighlight card={discardedCard} /> : '?',
              }}
            />
          )}
          {/* // TODO: Handle other resolution keywords */}
          {logEntry.resolutionKeyword !== RESOLUTION_KEYWORD.AUTO_ELIMINATE &&
            eliminatedPlayers.length > 0 && (
              <Translate
                en="The player {eliminatedPlayers} was eliminated."
                pt="O jogador {eliminatedPlayers} foi eliminado."
                values={{
                  eliminatedPlayers: (
                    <EliminatedHighlight type="negative">
                      <PlayerAvatarName player={eliminatedPlayers[0]} />
                    </EliminatedHighlight>
                  ),
                }}
              />
            )}
        </PlayAreaWithCard>
      );
    }

    // RANK 6
    case KEYWORDS.TRADE_HANDS: {
      return (
        <PlayAreaWithCard playedCard={playedCard}>
          {everyPrefix}
          <Translate
            en=" and chose {target} to trade hands with."
            pt=" e escolheu {target} para trocar de mãos."
            values={{
              target: (
                <TargetHighlight>
                  <PlayerAvatarName player={targets[0]} />
                </TargetHighlight>
              ),
            }}
          />
        </PlayAreaWithCard>
      );
    }
    case KEYWORDS.FORCE_TRADE:
      return (
        <PlayAreaWithCard playedCard={playedCard}>
          {everyPrefix}
          <Translate
            en=" and chose {target1} and {target2} to trade hands with."
            pt=" e escolheu {target1} e {target2} para trocarem de mãos."
            values={{
              target1: (
                <TargetHighlight>
                  <PlayerAvatarName player={targets[0]} />
                </TargetHighlight>
              ),
              target2: (
                <TargetHighlight>
                  <PlayerAvatarName player={targets[1]} />
                </TargetHighlight>
              ),
            }}
          />
        </PlayAreaWithCard>
      );
    case KEYWORDS.TRADE_ASIDE:
      return (
        <PlayAreaWithCard playedCard={playedCard}>
          {everyPrefix}
          <Translate
            en=" and traded their hands with one of the cards set aside."
            pt=" e trocou de mãos com uma das cartas separadas."
          />
        </PlayAreaWithCard>
      );

    // RANK 7
    case KEYWORDS.EXCHANGE_TOP: {
      return (
        <PlayAreaWithCard playedCard={playedCard}>
          {everyPrefix}
          <Translate
            en=" and exchange their card with the one on top of the deck. Their card is now the next card to be drawn."
            pt=" e trocou a carta na mão com a carta do topo do baralho. A carta na mão agora é a próxima a ser comprada."
          />
        </PlayAreaWithCard>
      );
    }
    case KEYWORDS.PASS_LEFT:
      return (
        <PlayAreaWithCard playedCard={playedCard}>
          {everyPrefix}
          <Translate
            en=" and he ordered everybody to pass their card to the player on the left of them in the turn order. Do you like your new cards?"
            pt=" e ordenou que todos passassem a carta para o jogador à sua esquerda na ordem de turno. Você gosta da sua nova carta?"
          />
        </PlayAreaWithCard>
      );
    case KEYWORDS.SHUFFLE:
      return (
        <PlayAreaWithCard playedCard={playedCard}>
          {everyPrefix}
          <Translate
            en=" and he ordered all the cards in the center, shuffled them, and gave a random card to each player. Do you like your new card?"
            pt=" e ordenou que todas as cartas no centro fossem embaralhadas e deu uma carta aleatória para cada jogador. Você gosta da sua nova carta?"
          />
        </PlayAreaWithCard>
      );

    // RANK 8
    case KEYWORDS.FORCE_PLAY: {
      return (
        <PlayAreaWithCard playedCard={playedCard}>
          {everyPrefix}.
          <br />
          <br />
          <Translate
            pt="Será que foi porque a outra carta em mãos era de valor 6 ou maior?"
            en="Could it be because the other card in hand was of value 6 or higher?"
          />
        </PlayAreaWithCard>
      );
    }

    // RANK 9
    case KEYWORDS.WIN_PENALTY:
      return (
        <PlayAreaWithCard playedCard={playedCard}>
          {everyPrefix}
          <Translate
            en=" and nothing happens. This card had a winning penalty if it had stayed in your hand."
            pt=" e nada acontece. Esta carta tinha uma penalidade de vitória se tivesse ficado na sua mão."
          />
        </PlayAreaWithCard>
      );

    // RANK 10
    case KEYWORDS.AUTO_ELIMINATE:
      return (
        <PlayAreaWithCard playedCard={playedCard}>
          {everyPrefix}
          <Translate
            en=" and this card can never be played or discarded. This player is eliminated."
            pt=" e esta carta nunca pode ser jogada ou descartada. Este jogador foi eliminado."
          />
        </PlayAreaWithCard>
      );

    // RANK 11
    case KEYWORDS.CONDITIONAL_WIN:
      return (
        <PlayAreaWithCard playedCard={playedCard}>
          {everyPrefix}
          <Translate
            en=" and nothing happens. This card is only for the end of the round when comparing ranks."
            pt=" e nada acontece. Esta carta só tem efeito no final da rodada quando comparando valores."
          />
        </PlayAreaWithCard>
      );

    default:
      return (
        <Alert
          title={
            <Translate
              en="Something went wrong, no effects explanation found."
              pt="Algo deu errado, nenhuma explicação de efeito encontrada."
            />
          }
          type="error"
        />
      );
  }
}

type PlayAreaWithCardProps = {
  playedCard: FestaJuninaCard;

  children: ReactNode;
};

function PlayAreaWithCard({ playedCard, children }: PlayAreaWithCardProps) {
  const { passiveCardWidth } = useCustomCardWidth();

  return (
    <div className="card-resolution-area">
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
