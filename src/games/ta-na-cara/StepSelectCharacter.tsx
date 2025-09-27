// Ant Design Resources
import { Flex } from 'antd';
// Types
import type { GamePlayer } from 'types/player';
import type { SuspectCard as Suspect } from 'types/tdr';
// Hooks
import { useMock } from 'hooks/useMock';
// Components
import { SuspectCard } from 'components/cards/SuspectCard';
import { ImageCardSelectButton } from 'components/image-cards/ImageCardSelectButton';
import { Translate } from 'components/language';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { Step, type StepProps } from 'components/steps';
import { RuleInstruction, StepTitle } from 'components/text';
// Internal
import type { SubmitIdentityPayload } from './utils/types';
import { mockCharacterSelection } from './utils/mock';

type StepSelectCharacterProps = {
  user: GamePlayer;
  identitiesDict: Dictionary<Suspect>;
  onSubmitIdentity: (payload: SubmitIdentityPayload) => void;
} & Pick<StepProps, 'announcement'>;

export function StepSelectCharacter({
  user,
  announcement,
  onSubmitIdentity,
  identitiesDict,
}: StepSelectCharacterProps) {
  const availableIdentities: CardId[] = user.availableIdentities ?? [];

  useMock(() => {
    onSubmitIdentity({ identityId: mockCharacterSelection(availableIdentities) });
  });

  return (
    <Step fullWidth announcement={announcement}>
      <StepTitle>
        <Translate pt="Sua identidade" en="Your identity" />
      </StepTitle>
      <RuleInstruction type="action">
        <Translate
          pt="Selecione um dos dois personagens para ser sua identidade para essa rodada"
          en="Select one of the two characters to be your identity for this round"
        />
      </RuleInstruction>

      <SpaceContainer>
        {availableIdentities.map((cardId) => {
          return (
            <Flex vertical key={cardId} align="center" gap={3}>
              <SuspectCard suspect={identitiesDict[cardId]} width={120} preview />
              <ImageCardSelectButton
                cardId={cardId}
                onClick={() => onSubmitIdentity({ identityId: cardId })}
                isSelected={user.selectedIdentity === cardId}
                standalone
              />
            </Flex>
          );
        })}
      </SpaceContainer>
    </Step>
  );
}
