import { useState } from 'react';
// Ant Design Resources
import { Button, Collapse, Space } from 'antd';
import { TrophyOutlined } from '@ant-design/icons';
// Utils
import { getAnimationClass, getLastItem } from 'utils/helpers';
import { isEntryLocked } from './utils/helpers';
// Components

import { Crime } from './components/Crime';
import { GroupedItemsBoard } from './components/GroupedItemsBoard';
import { ScoringMessage } from './components/RulesBlobs';
import { PlayersCards } from './components/PlayersCards';
import { CrimeGuessStatus } from './components/CrimeGuessStatus';
import { ResultsTable } from './components/ResultsTable';
import { Step } from 'components/steps';
import { Instruction, Title } from 'components/text';
import { Translate } from 'components/language';
import { PopoverRule } from 'components/rules';
import { TimedButton } from 'components/buttons';

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
  results: HResults;
  isFirstRunThrough: boolean;
};

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
}: StepRevealProps) {
  const [activePlayerId, setActivePlayerId] = useState<PlayerId>('');

  const playerCount = Object.keys(players).length;

  const activeCrime = crimes.find((crime) => crime.playerId === activePlayerId);
  const isOwnCrime = activePlayerId === user.id;
  const history: GuessHistoryEntry[] = user.history?.[(activeCrime! ?? {})?.playerId] ?? [];
  const latestHistoryEntry = getLastItem(history);
  const isLocked = isEntryLocked(latestHistoryEntry);

  return (
    <Step>
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
              {user.score + user.secretScore} pontos.
            </>
          }
          en={
            <>
              You guesses {user.correctCrimes} crimes and have a (secret) total of{' '}
              {user.score + user.secretScore} points.
            </>
          }
        />
      </Instruction>

      <Space className="space-container" align="center">
        <Collapse>
          <Collapse.Panel
            key="weapons-evidences"
            header={<Translate pt=" Ver todas Armas e Evidências" en="See all Weapons and Evidence" />}
          >
            <GroupedItemsBoard
              items={items}
              weaponId={user.weaponId}
              evidenceId={user.evidenceId}
              groupedItems={groupedItems}
            />
          </Collapse.Panel>
        </Collapse>
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
          className={getAnimationClass('slideInUp', undefined, 'fast')}
          key={`crime-by-${activeCrime.playerId}`}
        >
          <Crime
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
