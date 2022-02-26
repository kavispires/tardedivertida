import { Button } from 'antd';
import { useMemo, useState } from 'react';
import {
  ButtonContainer,
  FloatingHand,
  Instruction,
  ReadyPlayersBar,
  Step,
  Title,
  Translate,
} from '../../components';
import { useLanguage, useMock } from '../../hooks';
import { getAvatarColorById } from '../../utils/helpers';
import { Crime } from './Crime';
import { GroupedItemsBoard } from './GroupedItemsBoard';
import { splitWeaponsAndEvidence } from './helpers';
import { mockGuesses } from './mock';
import { PlayersCards } from './PlayersCards';
import { SelectableGroupedItemsBoard } from './SelectableGroupedItemsBoard';

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
  const { language } = useLanguage();
  const [guesses, setGuesses] = useState<PlainObject>({});
  const [activePlayerId, setActivePlayerId] = useState<string>('');

  const onUpdateGuesses = (itemId: string) => {
    if (activePlayerId && itemId) {
      const guessObj = {
        ...(guesses[activePlayerId] ?? {
          weaponId: undefined,
          evidenceId: undefined,
          isComplete: false,
        }),
      };

      const isWeapon = itemId.includes('wp');

      if (isWeapon) {
        guessObj.weaponId = itemId;
      } else {
        guessObj.evidenceId = itemId;
      }

      setGuesses((s: PlainObject) => ({
        ...s,
        [activePlayerId]: {
          ...guessObj,
          isComplete: Boolean(guessObj?.weaponId && guessObj?.evidenceId),
        },
      }));
    }
  };

  const { weapons, evidences } = useMemo(() => splitWeaponsAndEvidence(items, language), [items, language]);

  const playerCount = Object.keys(players).length;
  const isAllComplete =
    Object.values(guesses).length === playerCount - 1 &&
    Object.values(guesses).every((guess) => guess.isComplete);

  // DEV: Auto guesses
  useMock(() => {
    setGuesses(mockGuesses(weapons, evidences, players, user));
  }, []);

  const activeCrime = crimes.find((crime) => crime.playerId === activePlayerId);

  const activePlayerGuesses = guesses?.[activePlayerId] ?? {};

  return (
    <Step>
      <Title>
        <Translate pt="Quais foram os crimes?" en="What were the crimes?" />
      </Title>
      <Instruction contained>
        <Translate
          pt={
            <>
              Para cada crime, selecione as respostas que você acha correta.
              <br />
              Cada jogador tem o seu par de arma e objeto.
            </>
          }
          en={
            <>
              For each crime, select the answer you think best matches the clues.
              <br />
              Each player has their weapon and object.
            </>
          }
        />
      </Instruction>

      <PlayersCards
        user={user}
        activePlayerId={activePlayerId}
        setActivePlayerId={setActivePlayerId}
        players={players}
        guesses={guesses}
      />

      {isAllComplete && (
        <ButtonContainer>
          <Button
            size="large"
            type="primary"
            disabled={!isAllComplete}
            onClick={() => onSubmitGuesses({ guesses })}
          >
            <Translate pt="Enviar Respostas" en="Send Guesses" />
          </Button>
        </ButtonContainer>
      )}

      <SelectableGroupedItemsBoard
        items={items}
        weaponId={activePlayerGuesses.weaponId}
        evidenceId={activePlayerGuesses.evidenceId}
        groupedItems={groupedItems}
        onSelectItem={onUpdateGuesses}
        activeColor={getAvatarColorById(players[activePlayerId]?.avatarId)}
      />

      <ReadyPlayersBar players={players} />

      {activeCrime && (
        <FloatingHand type="stats">
          <Crime
            key={`crime-by-${activeCrime.playerId}`}
            user={user}
            crime={activeCrime}
            players={players}
            scenes={scenes}
            scenesOrder={scenesOrder}
            items={items}
            weapons={weapons}
            evidences={evidences}
            selections={activePlayerGuesses}
            // onUpdateGuesses={onUpdateGuesses}
          />
        </FloatingHand>
      )}
    </Step>
  );
}
