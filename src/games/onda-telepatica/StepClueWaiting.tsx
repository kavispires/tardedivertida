import { AvatarName, ButtonContainer, Translate, WaitingRoom } from '../../components';
import { Card } from './Card';

type StepClueWaitingProps = {
  players: GamePlayers;
  psychic: GamePlayer;
  currentCategories: OCategoryCard[];
  currentCategoryId: string;
};

export function StepClueWaiting({
  players,
  psychic,
  currentCategories,
  currentCategoryId,
}: StepClueWaitingProps) {
  const card = currentCategories.find((c) => c.id === currentCategoryId);

  return (
    <WaitingRoom
      players={players}
      title={<Translate pt={'Concentração...'} en={'Focus...'} />}
      instruction=""
    >
      {Boolean(!currentCategoryId) ? (
        <p>
          <AvatarName player={psychic} />
          <Translate
            pt={
              'escolherá uma carta com duas ideias opostas, e então terá que escrever uma dica que ajude você e os outros jogadores a escolher a posição correta do ponteiro no medidor de ondas telepáticas.'
            }
            en={
              'is choosing a card with two opposing ideas, then they will write a clue that will help you and the other players to find the correct position of the needle in the Wavelength measuring device...'
            }
          />
        </p>
      ) : (
        <div>
          <p>
            <AvatarName player={psychic} />
            <Translate pt={'escolheu:'} en={'chose:'} />
          </p>
          <ButtonContainer>
            <Card left={card!.left} right={card!.right} />
          </ButtonContainer>
          <p>
            <Translate
              pt={`Agora, é uma boa ideia pra discutir com o grupo em voz alta o que vocês acham ser super pra esquerda "${
                card!.left
              }" e super pra direita "${card!.right}". Isso ajuda o medium!`}
              en={`Now it's a good idea to discuss with the group out loud what you guys think it's extreme left "${
                card!.left
              }" and extreme right "${card!.right}". This might help the psychic!`}
            />
          </p>
        </div>
      )}
    </WaitingRoom>
  );
}