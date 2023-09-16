// Utils
import { DualTranslate } from 'components/language';

// Components
import { Title } from 'components/text';

type MinigameTitleProps = {
  title: DualLanguageValue;
};

export function MinigameTitle({ title }: MinigameTitleProps) {
  return (
    <Title size="small" white level={2} className="minigame-title__number">
      <DualTranslate>{title}</DualTranslate>
    </Title>
  );
}
