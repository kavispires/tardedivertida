import { CheckSquareFilled, CloseSquareFilled } from '@ant-design/icons';
import { Collapse, Table } from 'antd';
import { useMemo } from 'react';
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

type StepRevealProps = {
  user: GamePlayer;
  players: GamePlayers;
  items: ItemsDict;
  groupedItems: GroupedItems;
  scenes: ScenesDict;
  scenesOrder: string[];
  crimes: Crime[];
  onSeeRanking: GenericFunction;
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
}: StepRevealProps) {
  const { language, translate } = useLanguage();

  const { weapons, evidences } = useMemo(() => splitWeaponsAndEvidence(items, language), [items, language]);

  const playerCount = Object.keys(players).length;

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
              Se você acertou ambos, a gente te fala. Se você acertou so um ou outro... faça a matemática aí
              com os pontos.
              <br />
              Você acertou {user.correctCrimes} pares e conseguiu um total de {user.secretScore} pontos.
            </>
          }
          en={
            <>
              For each crime below, select the answer you think best matches the clues.
              <br />
              Each player has their weapon and object.
            </>
          }
        />
      </Instruction>

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

      <ul>
        {crimes.map((crime) => (
          <Crime
            key={`crime-by-${crime.playerId}`}
            user={user}
            crime={crime}
            items={items}
            players={players}
            scenes={scenes}
            scenesOrder={scenesOrder}
            selections={user.guesses[crime.playerId]}
            weapons={weapons}
            evidences={evidences}
          />
        ))}
      </ul>

      <ButtonContainer>
        <TimedButton
          onClick={onSeeRanking}
          onExpire={onSeeRanking}
          duration={45}
          label={<Translate en="Ver Ranking" pt="See Ranking" />}
        />
      </ButtonContainer>
    </Step>
  );
}
