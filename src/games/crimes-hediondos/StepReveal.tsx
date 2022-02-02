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
} from '../../components';
import { useLanguage } from '../../hooks';
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
  counts: PlainObject;
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
  counts,
  onSeeRanking,
}: StepRevealProps) {
  const { language, translate } = useLanguage();

  const { weapons, evidences } = useMemo(() => splitWeaponsAndEvidence(items, language), [items, language]);

  const playerCount = Object.keys(players).length;

  const columns = [
    {
      title: translate('Jogador', 'Player'),
      dataIndex: 'player',
      key: 'player',
      render: (data: any) => <AvatarName player={data} />,
      sorter: (a: any, b: any) => (a.name > b.name ? -1 : 1),
    },
    {
      title: translate('Itens corretos', 'Correct items'),
      dataIndex: 'correctItems',
      key: 'correctItems',
      sorter: (a: any, b: any) => (a.correctItems > b.correctItems ? -1 : 1),
    },
    {
      title: translate('Pares corretos', 'Correct pairs'),
      dataIndex: 'bothCorrect',
      key: 'bothCorrect',
      sorter: (a: any, b: any) => (a.bothCorrect > b.bothCorrect ? -1 : 1),
    },
    {
      title: translate('Ganhou?', 'Won?'),
      dataIndex: 'win',
      key: 'win',
      render: (value: any) =>
        value ? (
          <CheckSquareFilled style={{ color: 'green' }} />
        ) : (
          <CloseSquareFilled style={{ color: 'red' }} />
        ),
      sorter: (a: any, b: any) => (a.win > b.win ? -1 : 1),
    },
  ];

  const dataSource = Object.entries(counts).map(([playerId, data]) => {
    return {
      ...data,
      playerName: players[playerId].name,
      player: players[playerId],
    };
  });

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
              Para cada crime abaixo, selecione a resposta que você acha correta
              <br />
              Cada jogador tem o seu par de arma e objeto.
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
        {playerCount > 4 && (
          <Translate
            pt={
              <>
                <br />
                Em um jogo com {playerCount} jogadores, dois ou mais jogadores podem ter escolhido a mesma
                arma e objeto.
              </>
            }
            en={
              <>
                In a game with {playerCount} players, two or more players might have chosen the same weapon
                and object.
              </>
            }
          />
        )}
      </Instruction>

      <Collapse>
        <Collapse.Panel
          key="weapons-evidences"
          header={<Translate pt="Armas e Evidências" en="Weapons and Evidence" />}
        >
          <GroupedItemsBoard
            items={items}
            weaponId={user.weaponId}
            evidenceId={user.evidenceId}
            groupedItems={groupedItems}
          />
        </Collapse.Panel>
        <Collapse.Panel key="crimes" header={<Translate pt="Crimes por jogador" en="Crimes per player" />}>
          <ul>
            {crimes
              .filter((crime) => crime.playerId !== user.id)
              .map((crime) => (
                <Crime
                  key={`crime-by-${crime.playerId}`}
                  user={user}
                  crime={crime}
                  players={players}
                  scenes={scenes}
                  scenesOrder={scenesOrder}
                  items={items}
                  weapons={weapons}
                  evidences={evidences}
                />
              ))}
          </ul>
        </Collapse.Panel>
      </Collapse>

      <ButtonContainer>
        <Table columns={columns} dataSource={dataSource} pagination={false} />
      </ButtonContainer>

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
