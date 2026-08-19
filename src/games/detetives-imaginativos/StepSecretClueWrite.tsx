import { mockClue } from '@mock/clues';
import { useState } from 'react';
// Ant Design Resources
import { Input } from 'antd';
// Types
import type { GamePlayer } from 'types/game';
// Hooks
import { useLanguage } from '@hooks/useLanguage';
import { useLoading } from '@hooks/useLoading';
import { useMock } from '@hooks/useMock';
// Components
import { SendButton } from '@components/buttons/SendButton';
import { ImageCardHand } from '@components/image-cards/ImageCardHand';
import { Translate } from '@components/language/Translate';
import { SpaceContainer } from '@components/layout/SpaceContainer';
import { CardHighlight } from '@components/metrics/CardHighlight';
import { Step, type StepProps } from '@components/steps/Step';
import { RuleInstruction } from '@components/text/RuleInstruction';
import { StepTitle } from '@components/text/StepTitle';
// Internal
import type { SubmitSecretCluePayload } from './utils/types';
import { ImpostorHighlight } from './components/Highlights';

type SecretClueWriteProps = {
  onSubmitClue: (payload: SubmitSecretCluePayload) => void;
  user: GamePlayer;
} & Pick<StepProps, 'announcement'>;

export function StepSecretClueWrite({ user, onSubmitClue, announcement }: SecretClueWriteProps) {
  const { translate } = useLanguage();
  const { isLoading } = useLoading();
  const [clue, setClue] = useState('');

  useMock(() => onSubmitClue({ clue: mockClue('high') }));

  const onButtonClick = () => {
    onSubmitClue({
      clue,
    });
  };

  const onEnterInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onButtonClick();
    }
  };

  return (
    <Step
      fullWidth
      announcement={announcement}
    >
      <StepTitle>
        <Translate
          pt="Escreva a Pista!"
          en="Write a Clue!"
        />
      </StepTitle>
      <RuleInstruction type="action">
        <Translate
          pt="Escreva uma pista que relacione com {cards} cartas suas."
          en="Write a clue that relates to {cards} of your cards."
          values={{ cards: <CardHighlight>2</CardHighlight> }}
        />
        <br />
        <Translate
          pt="A pista pode ser qualquer coisa que você quiser. Não há restrições!"
          en="The clue can be anything you want. There are no restrictions!"
        />
        <br />
        <Translate
          pt="Você ganha pontos somente se o {impostor} <strong>NÃO</strong> for encontrado, então escolha algo fácil e generalizado para que haja cartas que se encaixem."
          en="You only get points if the {impostor} <strong>is NOT</strong> found by the others, so choose something easy and general that may possibly fit the cards."
          values={{ impostor: <ImpostorHighlight>Impostor</ImpostorHighlight> }}
        />
      </RuleInstruction>

      <SpaceContainer align="center">
        <Input
          className="uppercase-input"
          placeholder={translate({ pt: 'Escreva sua pista aqui', en: 'Write your clue here' })}
          onChange={(e) => setClue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onEnterInput(e)}
          size="large"
        />

        <SendButton
          type="primary"
          disabled={isLoading || clue.length < 1}
          onClick={onButtonClick}
          size="large"
        >
          <Translate
            pt="Enviar pista secreta"
            en="Send secret clue"
          />
        </SendButton>
      </SpaceContainer>

      <ImageCardHand
        hand={user.hand}
        sizeRatio={user.hand?.length}
      />
    </Step>
  );
}
