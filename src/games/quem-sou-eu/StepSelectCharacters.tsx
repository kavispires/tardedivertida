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
import { RuleInstruction, Title } from 'components/text';
import { Translate } from 'components/language';
import { TransparentButton } from 'components/buttons';
import { CardHighlight } from 'components/metrics/CardHighlight';
import { CharacterCard } from 'components/cards/CharacterCard';

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

      <RuleInstruction type="action">
        <Translate
          pt={
            <>
              <strong>Selecione</strong> 6 personagens/celebridades abaixo, dessas 5 serão usadas no jogo.
              <br />
              Essa etapa é necessária para que você não receba um personagem que não conheça.
            </>
          }
          en={
            <>
              <strong>Select</strong> 6 characters/celebrities below, 5 of them will be used in the game.
              <br />
              This step is necessary so that you don't receive a character you don't know.
            </>
          }
        />
      </RuleInstruction>

      <Space className="grid-container grid-template-6 gap-4" wrap>
        {availableCharacters.map((character: ContenderCard) => (
          <TransparentButton
            key={character.id}
            disabled={user.ready || isLoading}
            onClick={() => update(character.id)}
            active={selection[character.id]}
            activeClass="q-character-player"
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
