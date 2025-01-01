// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Components
import { MovieReviewCard } from 'components/cards/MovieReviewCard';
import { Translate } from 'components/language';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { Instruction, Title } from 'components/text';
// Internal
import { DecisionButtons } from './DecisionButtons';
import type { TestStepProps } from '../TestArea';

export function TextHighlightTest({ onResult, step }: TestStepProps) {
  const { translate } = useLanguage();
  return (
    <SpaceContainer className="full-width" vertical>
      <Title level={2} size="small">
        <Translate pt="Texto e Destaques de Texto" en="Text Highlights" />
      </Title>

      <Instruction contained>
        <Translate pt="Algumas vezes o texto será destacado" en="Sometimes text will be highlighted" />
      </Instruction>

      <SpaceContainer wrap className="full-width" vertical>
        <MovieReviewCard
          type="negative"
          text={translate(
            'O abacate tem três pernas de bambu madeira',
            'The avocado has three legs made of bamboo',
          )}
          highlights={['três pernas', 'three legs', 'madeira', 'bamboo']}
        />
      </SpaceContainer>

      <DecisionButtons
        step={step}
        onClick={onResult}
        prompt={{
          pt: 'Você consegue ler "O abacate tem três pernas de bambu madeira" dentro do quadrado roxo?',
          en: 'Are you able to read "The Avocado has three legs made of bamboo" inside the purple box?',
        }}
      />
    </SpaceContainer>
  );
}
