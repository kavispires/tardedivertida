import { useState } from 'react';
// Ant Design Resources
import { Button, Collapse, Space } from 'antd';
import { TrophyOutlined } from '@ant-design/icons';
// Types
import { GamePlayer, GamePlayers } from 'types/player';
import type { GameRound } from 'types/game';
import type { Crime, GroupedItems, GuessHistoryEntry, ItemsDict, Results, ScenesDict } from './utils/types';
// Utils
import { getAnimationClass, getLastItem } from 'utils/helpers';
import { isEntryLocked } from './utils/helpers';
// Hooks
import { useTemporarilyHidePlayersBar } from 'hooks/useTemporarilyHidePlayersBar';
// Components
import { CrimeSummary } from './components/CrimeSummary';
import { GroupedItemsBoard } from './components/GroupedItemsBoard';
import { ScoringMessage } from './components/RulesBlobs';
import { PlayersCards } from './components/PlayersCards';
import { CrimeGuessStatus } from './components/CrimeGuessStatus';
import { ResultsTable } from './components/ResultsTable';
import { Step, type StepProps } from 'components/steps';
import { Instruction, Title } from 'components/text';
import { Translate } from 'components/language';
import { PopoverRule } from 'components/rules';
import { TimedButton } from 'components/buttons';
import { PointsHighlight } from 'components/metrics/PointsHighlight';

type StepRevealProps = {
  user: GamePlayer;
  players: GamePlayers;
  items: ItemsDict;
  groupedItems: GroupedItems;
  scenes: ScenesDict;
  scenesOrder: string[];
  crimes: Crime[];
  onSeeRanking: GenericFunction;
  round: GameRound;
  results: Results;
  isFirstRunThrough: boolean;
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
}: StepRevealProps) {
  useTemporarilyHidePlayersBar();

  const [activePlayerId, setActivePlayerId] = useState<PlayerId>('');

  const playerCount = Object.keys(players).length;

  const activeCrime = crimes.find((crime) => crime.playerId === activePlayerId);
  const isOwnCrime = activePlayerId === user.id;
  const history: GuessHistoryEntry[] = user.history?.[(activeCrime! ?? {})?.playerId] ?? [];
  const latestHistoryEntry = getLastItem(history);
  const isLocked = isEntryLocked(latestHistoryEntry);

  return (
    <Step announcement={announcement}>
      <Title>
        <Translate pt="Resultado" en="Results" />
      </Title>

      <PopoverRule content={<ScoringMessage round={round} />} />
      <Instruction contained>
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

      <Space className="space-container" align="center">
        <Collapse
          items={[
            {
              key: 'weapons-evidences',
              label: <Translate pt=" Ver todas Armas e Evidências" en="See all Weapons and Evidence" />,
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
      </Space>

      <PlayersCards
        user={user}
        activePlayerId={activePlayerId}
        setActivePlayerId={setActivePlayerId}
        players={players}
        guesses={{}}
        history={user.history}
      />

      {Boolean(activePlayerId) && (
        <Instruction
          contained
          className={!isLocked && !isOwnCrime ? getAnimationClass('tada') : ''}
          key={`instruction-status-${activePlayerId}`}
        >
          {Boolean(latestHistoryEntry) ? (
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
            selectedWeaponId={isOwnCrime ? user.weaponId : latestHistoryEntry.weaponId}
            selectedEvidenceId={isOwnCrime ? user.evidenceId : latestHistoryEntry.evidenceId}
            isLocked={isLocked}
          />
        </div>
      )}

      <Space className="space-container" align="center">
        {isFirstRunThrough ? (
          <TimedButton
            onClick={onSeeRanking}
            onExpire={onSeeRanking}
            duration={Math.min(playerCount * 10, 60)}
            icon={<TrophyOutlined />}
          >
            <Translate pt="Ver Ranking" en="See Ranking" />
          </TimedButton>
        ) : (
          <Button onClick={onSeeRanking} icon={<TrophyOutlined />}>
            <Translate pt="Ver Ranking" en="See Ranking" />
          </Button>
        )}
      </Space>
    </Step>
  );
}
