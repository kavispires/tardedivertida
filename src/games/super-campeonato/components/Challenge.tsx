// Types
import type { TextCard } from 'types/tdr';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Components
import { Card } from 'components/cards/Card';
import { SpaceContainer } from 'components/layout/SpaceContainer';

type ChallengeProps = {
  challenge: TextCard;
};

export function Challenge({ challenge }: ChallengeProps) {
  const { translate } = useLanguage();
  return (
    <SpaceContainer>
      <Card
        header={translate({ pt: 'Desafio', en: 'Challenge' })}
        color="purple"
      >
        {challenge.text}
      </Card>
    </SpaceContainer>
  );
}
