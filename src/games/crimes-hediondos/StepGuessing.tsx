import { Button, Collapse } from 'antd';
import { useMemo, useState } from 'react';
import { ButtonContainer, Instruction, Step, Title, Translate } from '../../components';
import { Crime } from './Crime';
import { GroupedItemsBoard } from './GroupedItemsBoard';

type StepGuessingProps = {
  user: GamePlayer;
  players: GamePlayers;
  items: ItemsDict;
  groupedItems: GroupedItems;
  scenes: ScenesDict;
  scenesOrder: string[];
  crimes: Crime[];
  onSubmitGuesses: GenericFunction;
};

export function StepGuessing({
  user,
  groupedItems,
  items,
  players,
  scenes,
  scenesOrder,
  crimes,
  onSubmitGuesses,
}: StepGuessingProps) {
  const [guesses, setGuesses] = useState<PlainObject>({});

  const onUpdateGuesses = (payload: PlainObject) => {
    setGuesses((s: PlainObject) => ({
      ...s,
      [payload.playerId]: {
        weapon: payload?.weapon,
        evidence: payload?.evidence,
        isComplete: Boolean(payload?.weapon && payload?.evidence),
      },
    }));
  };

  const { weapons, evidences } = useMemo(
    () =>
      Object.values(items).reduce(
        (acc: PlainObject, item) => {
          if (item.type === 'weapon') {
            acc.weapons.push(item);
          } else {
            acc.evidences.push(item);
          }
          return acc;
        },
        {
          weapons: [],
          evidences: [],
        }
      ),
    [items]
  );

  const playerCount = Object.keys(players).length;
  const isAllComplete =
    Object.values(guesses).length === playerCount - 1 &&
    Object.values(guesses).every((guess) => guess.isComplete);

  return (
    <Step>
      <Title>
        <Translate pt="Qual foi seu último crime?" en="How was your last crime?" />
      </Title>
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
      </Collapse>

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
              weapons={weapons}
              evidences={evidences}
              onUpdateGuesses={onUpdateGuesses}
            />
          ))}
      </ul>

      <ButtonContainer>
        <Button
          size="large"
          type="primary"
          disabled={!isAllComplete}
          onClick={() => onSubmitGuesses(guesses)}
        >
          <Translate en="Enviar Respostas" pt="Send Guesses" />
        </Button>
      </ButtonContainer>
    </Step>
  );
}
