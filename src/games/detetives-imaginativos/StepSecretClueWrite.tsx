import { useState } from 'react';
// Ant Design Resources
import { Button, Input } from 'antd';
// Types
import type { GamePlayer } from 'types/player';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
import { useLoading } from 'hooks/useLoading';
// Components
import { ImageCardHand } from 'components/image-cards';
import { Translate } from 'components/language';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { CardHighlight } from 'components/metrics/CardHighlight';
import { Step, type StepProps } from 'components/steps';
import { Instruction, TextHighlight, StepTitle } from 'components/text';

type SecretClueWriteProps = {
  onSubmitClue: GenericFunction;
  user: GamePlayer;
} & Pick<StepProps, 'announcement'>;

export function StepSecretClueWrite({ user, onSubmitClue, announcement }: SecretClueWriteProps) {
  const { translate } = useLanguage();
  const { isLoading } = useLoading();
  const [clue, setClue] = useState('');

  const onButtonClick = () => {
    onSubmitClue({
      clue,
    });
  };

  const onEnterInput = (e: any) => {
    if (e.key === 'Enter') {
      onButtonClick();
    }
  };

  return (
    <Step fullWidth announcement={announcement}>
      <StepTitle>
        <Translate pt="Escreva a Pista!" en="Write a Clue!" />
      </StepTitle>
      <Instruction contained>
        <ul>
          <li>
            <Translate
              pt={
                <>
                  Escreva uma pista que relacione com <CardHighlight>2</CardHighlight> cartas suas.
                </>
              }
              en={
                <>
                  Write a clue that relates to <CardHighlight>2</CardHighlight> of your cards.
                </>
              }
            />
          </li>
          <li>
            <Translate
              pt="A pista pode ser qualquer coisa que você quiser. Não há restrições!"
              en="The clue can be anything you want. There are no restrictions!"
            />
          </li>
          <li>
            <Translate
              pt={
                <>
                  Você ganha pontos somente se o <TextHighlight>Impostor NÃO for encontrado</TextHighlight>,
                  então escolha algo fácil e generalizado.
                </>
              }
              en={
                <>
                  You only get points if <TextHighlight>the Impostor is NOT found</TextHighlight> by the
                  others, so choose something easy and general.
                </>
              }
            />
          </li>
        </ul>
      </Instruction>

      <SpaceContainer align="center">
        <Input
          className="uppercase-input"
          placeholder={translate('Escreva sua pista aqui', 'Write your clue here')}
          onChange={(e) => setClue(e.target.value)}
          onKeyPress={onEnterInput}
        />

        <Button type="primary" disabled={isLoading || clue.length < 1} onClick={onButtonClick}>
          <Translate pt="Enviar pista secreta" en="Send secret clue" />
        </Button>
      </SpaceContainer>

      <ImageCardHand hand={user.hand} sizeRatio={user.hand?.length} />
    </Step>
  );
}
