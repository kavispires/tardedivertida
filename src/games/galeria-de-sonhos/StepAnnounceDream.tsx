// Ant Design Resources
import { Alert, Divider, Space } from 'antd';
import { useMemo } from 'react';
// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
import { useTemporarilyHidePlayersBar } from 'hooks/useTemporarilyHidePlayersBar';
// Constants
import { GO_TO_CARD_PLAY_STEP } from './utils/constants';
// Helpers
import { getAvatarColorById } from 'utils/helpers';
// Components
import { Step } from 'components/steps';
import { AvatarName } from 'components/avatars';
import { Translate } from 'components/language';
import { ImageCard } from 'components/cards';
import { TimedButton } from 'components/buttons';
import { AdminNextPhaseButton } from 'components/admin';
import { ListPlayers } from './components/ListPlayers';
import { MatchCount } from './components/MatchCount';
import { TurnOrder } from 'components/players';

type MatchingPlayersReduceResult = {
  matchingPlayers: GamePlayer[];
  fallenMatchingPlayers: GamePlayer[];
};

type StepAnnounceDreamProps = {
  latest: LatestInfo;
  lastActivePlayer: GamePlayer;
  activePlayer: GamePlayer;
  playerInNightmare?: GamePlayer;
  setStep: GenericFunction;
  players: GamePlayers;
  gameOrder: TurnOrder;
};

export function StepAnnounceDream({
  latest,
  lastActivePlayer,
  activePlayer,
  setStep,
  players,
  playerInNightmare,
  gameOrder,
}: StepAnnounceDreamProps) {
  useTemporarilyHidePlayersBar();
  const cardWidth = useCardWidth(5, 8, 140, 150);

  const { matchingPlayers, fallenMatchingPlayers } = useMemo(
    () =>
      (latest?.matchedPlayers ?? []).reduce(
        (acc: MatchingPlayersReduceResult, playerId) => {
          const player = players[playerId];
          if (player?.fallen) {
            if (lastActivePlayer.id !== playerId) {
              acc.fallenMatchingPlayers.push(player);
            }
          } else {
            acc.matchingPlayers.push(player);
          }
          return acc;
        },
        { matchingPlayers: [], fallenMatchingPlayers: [] }
      ),
    [latest?.matchedPlayers, players, lastActivePlayer.id]
  );

  const completedPlayers = Object.values(players).filter((player) => player?.skip || player?.fallen);

  return (
    <Step fullWidth>
      <div className="g-dream-result">
        <header
          className="g-dream-result__header"
          style={{ backgroundColor: getAvatarColorById(lastActivePlayer.avatarId) }}
        >
          <AvatarName player={lastActivePlayer} size="large" />
          <Translate pt="escolheu visitar o sonho" en="chose to visit the dream" />:
        </header>
        <div className="g-dream-result__card">
          <ImageCard imageId={latest.cardId} cardWidth={cardWidth} />
        </div>
        <div className="g-dream-result__match-result">
          <MatchCount
            matchCount={latest.matchCount}
            lastActivePlayer={lastActivePlayer}
            playerInNightmare={playerInNightmare}
          />
        </div>
        <div className="g-dream-result__matching-players">
          {matchingPlayers.length > 0 && (
            <>
              <p>
                <Translate pt="Ganharam pontos:" en="Scored points:" />
              </p>

              <ListPlayers listPlayers={matchingPlayers} className="g-dream-result__matched-players-list" />
            </>
          )}
        </div>
        <div className="g-dream-result__fallen-matching-players">
          {fallenMatchingPlayers.length > 0 && (
            <>
              <p className="g-dream-result__label">
                <Translate
                  pt="Ganhariam pontos, mas já estão eliminados:"
                  en="Matched by are out of the round:"
                />
              </p>

              <ListPlayers
                listPlayers={fallenMatchingPlayers}
                className="g-dream-result__matched-players-list fallen"
              />
            </>
          )}
        </div>
        <footer className="g-dream-result__footer">
          {latest.isPhaseOver || latest.cardsLeft === 0 ? (
            <Space align="center" className="full-width padding" direction="vertical">
              <p className="center">
                <Translate
                  pt="Todos jogadores já usaram seus sonhos ou não deram match com ninguém. Vamos para a próxima rodada?"
                  en="All players have used their dreams or didn't match anybody. Ready for the next round?"
                />
              </p>
              {gameOrder.length === 1 && (
                <Alert
                  className="center"
                  type="error"
                  message={
                    playerInNightmare?.id === gameOrder[0] ? (
                      <Translate
                        pt={
                          <>
                            <AvatarName player={playerInNightmare} /> foi ganancioso(a) não conseguiu usar
                            todos os sonhos.
                          </>
                        }
                        en={
                          <>
                            <AvatarName player={playerInNightmare} /> was too greedy and wasn't able to use of
                            all their dreams.
                          </>
                        }
                      />
                    ) : (
                      <Translate
                        pt={
                          <>
                            Não há mais jogadores pra dar match com{' '}
                            <AvatarName player={players[gameOrder[0]]} />
                          </>
                        }
                        en={
                          <>
                            There are no players to match anymore with{' '}
                            <AvatarName player={players[gameOrder[0]]} />
                          </>
                        }
                      />
                    )
                  }
                />
              )}
            </Space>
          ) : (
            <Space align="center" className="full-width padding" direction="vertical">
              <p className="center">
                <Translate pt="Próximo jogador:" en="Next player:" />
                <AvatarName player={activePlayer} addressUser />
              </p>

              <TimedButton
                type="primary"
                duration={12}
                disabled
                onExpire={() => setStep(GO_TO_CARD_PLAY_STEP)}
              >
                <Translate pt="Continuando em..." en="Continuing in..." />
              </TimedButton>
            </Space>
          )}
          {completedPlayers.length > 0 && (
            <>
              <Divider />
              <div className="g-dream-result__completed-players">
                <p className="g-dream-result__label center">
                  <Translate pt="Jogadores fora do rodízio" en="Players out of rotation" />:
                </p>
                <ListPlayers
                  listPlayers={completedPlayers}
                  className="g-dream-result__matched-players-list g-dream-result__matched-players-list--centered"
                />
              </div>
            </>
          )}
        </footer>
      </div>

      {gameOrder.length > 1 && (
        <TurnOrder players={players} order={gameOrder} activePlayerId={activePlayer.id} />
      )}

      {(latest.isPhaseOver || latest.cardsLeft === 0) && (
        <AdminNextPhaseButton autoTriggerTime={15}>Ranking</AdminNextPhaseButton>
      )}
    </Step>
  );
}
