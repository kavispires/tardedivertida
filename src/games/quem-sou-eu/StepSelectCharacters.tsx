// Ant Design Resources
import { Button, Space } from 'antd';
// Hooks
import { useLoading } from 'hooks/useLoading';
import { useMock } from 'hooks/useMock';
import { useCardWidth } from 'hooks/useCardWidth';
import { useBooleanDictionary } from 'hooks/useBooleanDictionary';
// Utils
import { mockSelectCharacters } from './utils/mock';
// Components
import { Step } from 'components/steps';
import { Instruction, Title } from 'components/text';
import { Translate } from 'components/language';
import { TransparentButton } from 'components/buttons';
import { CharacterCard } from './components/CharacterCard';
import { CardHighlight } from 'components/metrics/CardHighlight';

type StepSelectCharactersProps = {
  user: GamePlayer;
  onSelectCharacters: GenericFunction;
} & AnnouncementProps;

export function StepSelectCharacters({ user, announcement, onSelectCharacters }: StepSelectCharactersProps) {
  const { isLoading } = useLoading();
  const cardWidth = useCardWidth(12, {
    gap: 16,
    minWidth: 100,
    maxWidth: 200,
  });
  const {
    dict: selection,
    updateDict: update,
    length: count,
    keys: selectedCharacters,
  } = useBooleanDictionary({});

  const availableCharacters = user.availableCharacters ?? [];

  useMock(() => {
    onSelectCharacters({ characters: mockSelectCharacters(availableCharacters) });
  });

  return (
    <Step fullWidth announcement={announcement}>
      <Title>
        <Translate
          pt={
            <>
              Selecione <CardHighlight>6</CardHighlight> cartas
            </>
          }
          en={
            <>
              Select <CardHighlight>6</CardHighlight> cards
            </>
          }
        />
      </Title>

      <Instruction contained>
        <Translate
          pt={
            <>
              Não queremos que você receba uma carta que não conheça, então das cartas abaixo, selecione 6
              para entrar no jogo.
            </>
          }
          en={
            <>
              We don't want a card you don't know to be assigned to you, so from the cards below, select 6 to
              be in the game.
            </>
          }
        />
      </Instruction>

      <Space className="space-container" wrap>
        {availableCharacters.map((character: ContenderCard) => (
          <TransparentButton
            key={character.id}
            disabled={user.ready || isLoading}
            onClick={() => update(character.id)}
            active={selection[character.id]}
          >
            <CharacterCard size={cardWidth} character={character} />
          </TransparentButton>
        ))}
      </Space>

      <Space className="space-container">
        <Button
          size="large"
          type="primary"
          onClick={() => onSelectCharacters({ characters: selectedCharacters })}
          disabled={isLoading || user.ready || count !== 6}
        >
          <Translate pt={<>Enviar {count} cartas</>} en={<>Submit {count} cards</>} />
        </Button>
        <Button
          size="large"
          onClick={() => onSelectCharacters({ characters: mockSelectCharacters(availableCharacters) })}
          disabled={isLoading || user.ready}
        >
          <Translate pt={<>Escolha pra mim</>} en={<>Choose for me</>} />
        </Button>
      </Space>
    </Step>
  );
}
