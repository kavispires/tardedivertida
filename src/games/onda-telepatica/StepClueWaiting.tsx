// Ant Design Resources
import { Space } from 'antd';
// Components
import { AvatarName } from 'components/avatars';
import { Translate } from 'components/language';
import { WaitingRoom } from 'components/players';
import { Step } from 'components/steps';
import { Instruction, TextHighlight } from 'components/text';
import { OpposingIdeasCard } from './components/OpposingIdeasCard';

type StepClueWaitingProps = {
  players: GamePlayers;
  psychic: GamePlayer;
  currentCategories: OCategoryCard[];
  currentCategoryId: string;
} & AnnouncementProps;

export function StepClueWaiting({
  players,
  psychic,
  currentCategories,
  currentCategoryId,
  announcement,
}: StepClueWaitingProps) {
  const card = currentCategories.find((c) => c.id === currentCategoryId);

  return (
    <Step announcement={announcement}>
      <WaitingRoom
        players={players}
        title={<Translate pt={'Concentração...'} en={'Focus...'} />}
        instruction=""
      >
        <Instruction contained>
          {Boolean(!currentCategoryId) ? (
            <p>
              <Translate
                pt={
                  <>
                    <AvatarName player={psychic} /> escolherá uma carta com duas ideias opostas, e então terá
                    que escrever uma dica que ajude você e os outros jogadores a escolher a posição correta do
                    ponteiro no medidor de ondas telepáticas.
                  </>
                }
                en={
                  <>
                    <AvatarName player={psychic} /> is choosing a card with two opposing ideas, then they will
                    write a clue that will help you and the other players to find the correct position of the
                    needle in the Wavelength measuring device.
                  </>
                }
              />
            </p>
          ) : (
            <>
              <p>
                <AvatarName player={psychic} />
                <Translate pt={'escolheu:'} en={'chose:'} />
              </p>
              <Space className="space-container" align="center">
                <OpposingIdeasCard left={card!.left} right={card!.right} />
              </Space>
              <p>
                <Translate
                  pt={
                    <>
                      Agora, é uma boa ideia pra discutir com o grupo em voz alta o que vocês acham ser super
                      pra esquerda <TextHighlight>{card!.left}</TextHighlight> e super pra direita{' '}
                      <TextHighlight>{card!.right}</TextHighlight>. Isso ajuda o medium!
                    </>
                  }
                  en={
                    <>
                      Now it's a good idea to discuss with the group out loud what you guys think it's extreme
                      left <TextHighlight>{card!.left}</TextHighlight> and extreme right{' '}
                      <TextHighlight>{card!.right}</TextHighlight>. This might help the psychic!
                    </>
                  }
                />
              </p>
            </>
          )}
        </Instruction>
      </WaitingRoom>
    </Step>
  );
}
