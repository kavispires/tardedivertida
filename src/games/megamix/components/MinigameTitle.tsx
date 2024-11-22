// Components
import { DualTranslate } from 'components/language';
import { Title } from 'components/text';

type MinigameTitleProps = {
  title: DualLanguageValue;
};

export function MinigameTitle({ title }: MinigameTitleProps) {
  return (
    <Title size="small" level={2} className="minigame-title__number">
      <DualTranslate>{title}</DualTranslate>
    </Title>
  );
}
