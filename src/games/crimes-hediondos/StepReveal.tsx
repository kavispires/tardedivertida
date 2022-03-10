import { CheckSquareFilled, CloseSquareFilled } from '@ant-design/icons';
import { Collapse, Table } from 'antd';
import { useMemo, useState } from 'react';
import {
  AvatarName,
  ButtonContainer,
  Instruction,
  PopoverRule,
  Step,
  TimedButton,
  Title,
  Translate,
} from 'components';
import { useLanguage } from 'hooks';
import { Crime } from './Crime';
import { GroupedItemsBoard } from './GroupedItemsBoard';
import { splitWeaponsAndEvidence } from './helpers';
import { ScoringMessage } from './RulesBlobs';
import { PlayersCards } from './PlayersCards';
import { getLastItem } from 'utils/helpers';
import { CrimeGuessStatus } from './CrimeGuessStatus';
// Ant Design Resources
// Hooks
// Utils
// Components

type StepRevealProps = {
  user: GamePlayer;
  players: GamePlayers;
  items: ItemsDict;
  groupedItems: GroupedItems;
  scenes: ScenesDict;
  scenesOrder: string[];
  crimes: Crime[];
  onSeeRanking: GenericFunction;
  currentRound: number;
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
  currentRound,
}: StepRevealProps) {
  const { language, translate } = useLanguage();
  const [activePlayerId, setActivePlayerId] = useState<PlayerId>('');

  const playerCount = Object.keys(players).length;

  const activeCrime = crimes.find((crime) => crime.playerId === activePlayerId);
  const isOwnCrime = activePlayerId === user.id;
  const history: GuessHistoryEntry[] = user.history?.[(activeCrime! ?? {})?.playerId] ?? [];
  const latestHistoryEntry = getLastItem(history);

  return (
    <Step>
      <Title>
        <Translate pt="Resultado" en="Results" />
      </Title>

      <PopoverRule content={<ScoringMessage />} />
      <Instruction contained>
        <Translate
          pt={
            <>
              Reescrever...
              <br />
              Você acertou {user.correctCrimes} pares e conseguiu um total de {user.secretScore} pontos.
            </>
          }
          en={
            <>
              Rewrite
              <br />
              Each player has their weapon and object.
            </>
          }
        />
      </Instruction>

      <ButtonContainer>
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
      </ButtonContainer>

      <PlayersCards
        user={user}
        activePlayerId={activePlayerId}
        setActivePlayerId={setActivePlayerId}
        players={players}
        guesses={{}}
      />

      {Boolean(activePlayerId) && (
        <Instruction contained>
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
        <Crime
          key={`crime-by-${activeCrime.playerId}`}
          crime={activeCrime}
          scenes={scenes}
          scenesOrder={scenesOrder}
          items={items}
          history={user.history[activeCrime.playerId]}
          player={players[activeCrime.playerId]}
          selectedWeaponId={isOwnCrime ? user.weaponId : latestHistoryEntry.weaponId}
          selectedEvidenceId={isOwnCrime ? user.evidenceId : latestHistoryEntry.evidenceId}
        />
      )}

      <ButtonContainer>
        <TimedButton
          onClick={onSeeRanking}
          onExpire={onSeeRanking}
          duration={Math.min(playerCount * 10, 60)}
          label={<Translate en="Ver Ranking" pt="See Ranking" />}
        />
      </ButtonContainer>
    </Step>
  );
}
