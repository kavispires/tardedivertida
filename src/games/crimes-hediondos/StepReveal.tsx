import { useState } from 'react';
// Ant Design Resources
import { TrophyOutlined } from '@ant-design/icons';
import { Button, Collapse } from 'antd';
// Types
import type { GameRound } from 'types/game';
import type { GamePlayer, GamePlayers } from 'types/player';
// Hooks
import { useTemporarilyHidePlayersBar } from 'hooks/useTemporarilyHidePlayersBar';
// Utils
import { getAnimationClass, getLastItem } from 'utils/helpers';
// Components
import { TimedButton } from 'components/buttons';
import { Translate } from 'components/language';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { PointsHighlight } from 'components/metrics/PointsHighlight';
import { PopoverRule } from 'components/rules';
import { Step, type StepProps } from 'components/steps';
import { Instruction, RuleInstruction, StepTitle } from 'components/text';
// Internal
import type { Crime, GroupedItems, GuessHistoryEntry, ItemsDict, Results, ScenesDict } from './utils/types';
import { isEntryLocked } from './utils/helpers';
import { CrimeSummary } from './components/CrimeSummary';
import { GroupedItemsBoard } from './components/GroupedItemsBoard';
import { ScoringMessage } from './components/RulesBlobs';
import { PlayersCards } from './components/PlayersCards';
import { CrimeGuessStatus } from './components/CrimeGuessStatus';
import { ResultsTable } from './components/ResultsTable';

type StepRevealProps = {
  user: GamePlayer;
  players: GamePlayers;
  items: ItemsDict;
  groupedItems: GroupedItems;
  scenes: ScenesDict;
  scenesOrder: string[];
  crimes: Crime[];
  onSeeRanking: () => void;
  round: GameRound;
  results: Results;
  isFirstRunThrough: boolean;
  isVictimGame: boolean;
  isLocationGame: boolean;
} & Pick<StepProps, 'announcement'>;

export function StepReveal({
  user,
  groupedItems,
  items,
  players,
  scenes,
  scenesOrder,
  crimes,
  onSeeRanking,
  round,
  results,
  isFirstRunThrough,
  announcement,
  isVictimGame,
  isLocationGame,
}: StepRevealProps) {
  useTemporarilyHidePlayersBar();

  const [activePlayerId, setActivePlayerId] = useState<PlayerId>('');

  const playerCount = Object.keys(players).length;

  const activeCrime = crimes.find((crime) => crime.playerId === activePlayerId);
  const isOwnCrime = activePlayerId === user.id;
  const history: GuessHistoryEntry[] = activeCrime ? (user.history?.[activeCrime?.playerId] ?? []) : [];
  const latestHistoryEntry = getLastItem(history);
  const isLocked = isEntryLocked(latestHistoryEntry);

  return (
    <Step announcement={announcement}>
      <StepTitle>
        <Translate pt="Resultado" en="Results" />
      </StepTitle>

      <PopoverRule content={<ScoringMessage round={round} />} />
      <RuleInstruction type="rule">
        <Translate
          pt={
            <>
              Veja aqui como todos os jogadores foram. Passe o mouse nos ícones para saber mais detalhes.
              <br />
              As colunas são os crimes e as linhas são os chutes dessa rodada de cada jogador.
            </>
          }
          en={
            <>
              See how all players did. Hover the icons to see details.
              <br />
              The columns are the crimes and the rows are the guesses for each player.
            </>
          }
        />
      </RuleInstruction>

      <Instruction contained>
        <ResultsTable players={players} results={results} />

        <Translate
          pt={
            <>
              Você acertou {user.correctCrimes} pares e está com um total (secreto) de{' '}
              <PointsHighlight>{user.score + user.secretScore} pontos</PointsHighlight>.
            </>
          }
          en={
            <>
              You guesses {user.correctCrimes} crimes and have a (secret) total of{' '}
              <PointsHighlight>{user.score + user.secretScore} points</PointsHighlight>.
            </>
          }
        />
      </Instruction>

      <SpaceContainer>
        <Instruction contained>
          <Collapse
            items={[
              {
                key: 'weapons-evidences',
                label: <Translate pt=" Ver todas cartas" en="See all cards" />,
                children: (
                  <GroupedItemsBoard
                    items={items}
                    weaponId={user.weaponId}
                    evidenceId={user.evidenceId}
                    groupedItems={groupedItems}
                  />
                ),
              },
            ]}
          />
        </Instruction>
      </SpaceContainer>

      <PlayersCards
        user={user}
        setActivePlayerId={setActivePlayerId}
        players={players}
        guesses={{}}
        history={user.history}
      >
        {!activePlayerId && (
          <Instruction contained>
            <Translate
              pt="Clique em um jogador para ver o resultado do seu crime"
              en="Click a player to see their crime"
            />
          </Instruction>
        )}
        {Boolean(activePlayerId) && (
          <Instruction
            contained
            className={!isLocked && !isOwnCrime ? getAnimationClass('tada') : ''}
            key={`instruction-status-${activePlayerId}`}
          >
            {latestHistoryEntry ? (
              <CrimeGuessStatus status={latestHistoryEntry.status} withDescription />
            ) : isOwnCrime ? (
              <Translate pt="Este é o seu próprio crime" en="This is your own crime" />
            ) : (
              ''
            )}
          </Instruction>
        )}

        {activeCrime && (
          <div
            className={getAnimationClass('slideInUp', { speed: 'fast' })}
            key={`crime-by-${activeCrime.playerId}`}
          >
            <CrimeSummary
              crime={activeCrime}
              scenes={scenes}
              scenesOrder={scenesOrder}
              items={items}
              history={user.history[activeCrime.playerId]}
              player={players[activeCrime.playerId]}
              isLocked={isLocked}
              selectedWeaponId={isOwnCrime ? user.weaponId : latestHistoryEntry.weaponId}
              selectedEvidenceId={isOwnCrime ? user.evidenceId : latestHistoryEntry.evidenceId}
              selectedVictimId={isOwnCrime ? user.victimId : latestHistoryEntry.victimId}
              selectedLocationId={isOwnCrime ? user.locationId : latestHistoryEntry.locationId}
              isLocationGame={isLocationGame}
              isVictimGame={isVictimGame}
            />
          </div>
        )}
      </PlayersCards>

      <SpaceContainer>
        {isFirstRunThrough ? (
          <TimedButton
            onClick={onSeeRanking}
            onExpire={onSeeRanking}
            duration={Math.min(playerCount * 15, 60)}
            icon={<TrophyOutlined />}
          >
            <Translate pt="Ver Ranking" en="See Ranking" />
          </TimedButton>
        ) : (
          <Button onClick={onSeeRanking} icon={<TrophyOutlined />}>
            <Translate pt="Ver Ranking" en="See Ranking" />
          </Button>
        )}
      </SpaceContainer>
    </Step>
  );
}
