import { keyBy } from 'lodash';
import { useMemo } from 'react';
// Ant Design Resources
import { Alert, Flex, Space } from 'antd';
// Types
import type { PhaseProps } from 'types/game';
// Icons
import { ArrowIcon } from '@icons/ArrowIcon';
import { CheckMarkIcon } from '@icons/CheckMarkIcon';
import { FlagIcon } from '@icons/FlagIcon';
import { XIcon } from '@icons/XIcon';
// Components
import { Achievements } from '@components/achievements/Achievements';
import { SuspectCard } from '@components/cards/SuspectCard';
import { Icon } from '@components/general/Icon';
import { Translate } from '@components/language/Translate';
import { SpaceContainer } from '@components/layout/SpaceContainer';
import { PlayerAvatarCard } from '@components/player/PlayerAvatarCard';
import { GameOverWrapper } from '@components/results/GameOverWrapper';
// Internal
import type { PhaseGameOverState } from './utils/types';
import achievementsReference from './utils/achievements';
import { CharactersBoard } from './components/CharactersBoard';
import { QuestionHistory } from './components/QuestionHistory';

export function PhaseGameOver({ state, players, user }: PhaseProps<PhaseGameOverState>) {
  const charactersDict = useMemo(() => {
    return keyBy(state.characters, 'id');
  }, [state.characters]);

  return (
    <GameOverWrapper
      state={state}
      players={players}
      announcementIcon={<FlagIcon />}
    >
      <Space className="mb-5">
        {state.turnOrder.map((playerId) => {
          const player = players[playerId];
          const targetPlayer = players[player.targetPlayerId ?? user.id];
          const targetPlayerCharacter = charactersDict?.[targetPlayer.secretCharacterId];
          const guessedCharacter = player.guess ? charactersDict?.[player.guess] : null;
          const isCorrect = guessedCharacter?.id === targetPlayerCharacter?.id;

          if (!targetPlayerCharacter || !guessedCharacter) {
            return (
              <div
                key={player.id}
                className="contained"
              >
                <Flex
                  vertical
                  justify="center"
                  align="center"
                >
                  <PlayerAvatarCard
                    player={player}
                    size="small"
                    withRoundCorners
                    withName
                  />
                  <Alert
                    title={
                      <Translate
                        en="Error"
                        pt="Erro"
                      />
                    }
                    type="error"
                  />
                </Flex>
              </div>
            );
          }

          return (
            <div
              key={player.id}
              className="contained results-grid"
            >
              <PlayerAvatarCard
                player={player}
                size="small"
                withRoundCorners
                withName
              />
              <Icon icon={<ArrowIcon />} />
              <PlayerAvatarCard
                player={players[player.targetPlayerId ?? user.id]}
                size="small"
                withRoundCorners
                withName
              />

              <Flex vertical>
                <span className="text-center">
                  <Translate
                    en="guessed"
                    pt="chutou"
                  />
                </span>
                <SuspectCard
                  suspect={guessedCharacter}
                  visibleContent={{ deckIcon: false }}
                  width={64}
                />
              </Flex>

              <Flex
                vertical
                align="center"
                justify="center"
              >
                <Icon icon={isCorrect ? <CheckMarkIcon /> : <XIcon />} />
              </Flex>

              <Flex vertical>
                <span className="text-center">
                  {isCorrect ? (
                    <Translate
                      en="and it was"
                      pt="e era"
                    />
                  ) : (
                    <Translate
                      en="but it was"
                      pt="mas era"
                    />
                  )}
                </span>
                <SuspectCard
                  suspect={targetPlayerCharacter}
                  visibleContent={{ deckIcon: false }}
                  width={64}
                />
              </Flex>
            </div>
          );
        })}
      </Space>

      <Achievements
        players={players}
        achievements={state.achievements}
        reference={achievementsReference}
      />

      <SpaceContainer>
        <CharactersBoard
          characters={state.characters}
          players={players}
          user={user}
          revealCharacters
          questionsHistory={state.questionsHistory}
          disableEliminations
        />
        <QuestionHistory
          players={players}
          questionsHistory={state.questionsHistory}
          user={user}
        />
      </SpaceContainer>
    </GameOverWrapper>
  );
}
