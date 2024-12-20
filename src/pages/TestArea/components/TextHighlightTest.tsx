// Ant Design Resources
import { Space } from "antd";
// Hooks
import { useLanguage } from "hooks/useLanguage";
// Components
import { MovieReviewCard } from "components/cards/MovieReviewCard";
import { Translate } from "components/language";
import { Instruction, Title } from "components/text";
// Internal
import { DecisionButtons } from "./DecisionButtons";
import { TestStepProps } from "../TestArea";

export function TextHighlightTest({ onResult, step }: TestStepProps) {
  const { translate } = useLanguage();
  return (
    <Space className="space-container full-width" direction="vertical">
      <Title level={2} size="small">
        <Translate pt="Texto e Destaques de Texto" en="Text Highlights" />
      </Title>

      <Instruction contained>
        <Translate
          pt="Algumas vezes o texto será destacado"
          en="Sometimes text will be highlighted"
        />
      </Instruction>

      <Space wrap className="space-container full-width" direction="vertical">
        <MovieReviewCard
          type="negative"
          text={translate(
            "O abacate tem três pernas de bambu madeira",
            "The avocado has three legs made of bamboo",
          )}
          highlights={["três pernas", "three legs", "madeira", "bamboo"]}
        />
      </Space>

      <DecisionButtons
        step={step}
        onClick={onResult}
        prompt={{
          pt: 'Você consegue ler "O abacate tem três pernas de bambu madeira" dentro do quadrado roxo?',
          en: 'Are you able to read "The Avocado has three legs made of bamboo" inside the purple box?',
        }}
      />
    </Space>
  );
}
