// Types
import type { TextCardData } from 'types/tdr';
// Hooks
import { useLanguage } from '@hooks/useLanguage';
// Components
import { TextCard } from '@components/cards/TextCard';
import { SpaceContainer } from '@components/layout/SpaceContainer';

type ChallengeProps = {
  challenge: TextCardData;
};

export function Challenge({ challenge }: ChallengeProps) {
  const { translate } = useLanguage();
  return (
    <SpaceContainer>
      <TextCard
        header={translate({ pt: 'Desafio', en: 'Challenge' })}
        color="purple"
      >
        {challenge.text}
      </TextCard>
    </SpaceContainer>
  );
}
