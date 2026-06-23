// Ant Design Resources
import { Badge, Space } from 'antd';
// Types
import type { GamePlayer } from 'types/game';
import type { ContenderCardData } from 'types/tdr';
// Hooks
import { useBooleanDictionary } from '@hooks/useBooleanDictionary';
import { useCardWidth } from '@hooks/useCardWidth';
import { useLoading } from '@hooks/useLoading';
import { useMock } from '@hooks/useMock';
// Components
import { SendButton } from '@components/buttons/SendButton';
import { TransparentButton } from '@components/buttons/TransparentButton';
import { CharacterCard } from '@components/cards/CharacterCard';
import { Translate } from '@components/language/Translate';
import { SpaceFloat } from '@components/layout/SpaceFloat';
import { CardHighlight } from '@components/metrics/CardHighlight';
import { Step, type StepProps } from '@components/steps/Step';
import { RuleInstruction } from '@components/text/RuleInstruction';
import { StepTitle } from '@components/text/StepTitle';
// Internal
import { mockSelectCharacters } from './utils/mock';
import type { SubmitCharactersPayload } from './utils/types';

type StepSelectCharactersProps = {
  user: GamePlayer;
  onSelectCharacters: (payload: SubmitCharactersPayload) => void;
} & Pick<StepProps, 'announcement'>;

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
    <Step
      fullWidth
      announcement={announcement}
    >
      <StepTitle>
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
      </StepTitle>

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

      <Space
        className="grid-container grid-template-6 gap-4"
        wrap
      >
        {availableCharacters.map((character: ContenderCardData) => (
          <TransparentButton
            key={character.id}
            disabled={user.ready || isLoading}
            onClick={() => update(character.id)}
            active={selection[character.id]}
            activeClass="q-character-player"
          >
            <CharacterCard
              size={cardWidth}
              character={character}
            />
          </TransparentButton>
        ))}
      </Space>

      <SpaceFloat>
        <SendButton
          size="large"
          type="dashed"
          onClick={() => onSelectCharacters({ characters: mockSelectCharacters(availableCharacters) })}
          loading={isLoading}
          disabled={isLoading || user.ready}
        >
          <Translate
            pt={<>Escolha pra mim</>}
            en={<>Choose for me</>}
          />
        </SendButton>
        <Badge count={count}>
          <SendButton
            size="large"
            onClick={() => onSelectCharacters({ characters: selectedCharacters })}
            loading={isLoading}
            disabled={user.ready || count !== 6}
          >
            <Translate
              pt="Enviar cartas"
              en="Submit cards"
            />
          </SendButton>
        </Badge>
      </SpaceFloat>
    </Step>
  );
}
