// Ant Design Resources
import { Flex } from 'antd';
// Types
import type { GameRound, GamePlayers, GamePlayer } from 'types/game';
import type { Item } from 'types/tdr';
// Hooks
import { useMock } from 'hooks/useMock';
// Components
import { SendButton } from 'components/buttons/SendButton';
import { Translate } from 'components/language/Translate';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { Step, type StepProps } from 'components/steps/Step';
import { RuleInstruction } from 'components/text/RuleInstruction';
import { StepTitle } from 'components/text/StepTitle';
// Internal
import type { Concept } from './utils/types';
import { ConceptCreationBlock } from './components/ConceptCreationBlock';

type StepNewConceptsProps = {
  players: GamePlayers;
  user: GamePlayer;
  basicConcepts: Concept[];
  concepts: Concept[];
  round: GameRound;
  items: Dictionary<Item>;
  onMakeMeReady: () => void;
} & Pick<StepProps, 'announcement'>;

export function StepNewConcepts({
  user,
  players,
  announcement,
  items,
  round,
  concepts,
  onMakeMeReady,
}: StepNewConceptsProps) {
  // Dev Only: Mock action to simulate readiness
  useMock(() => onMakeMeReady());

  return (
    <Step
      fullWidth
      announcement={announcement}
    >
      <StepTitle>
        <Translate
          pt={<>Novos Conceitos</>}
          en={<>New Concepts</>}
        />
      </StepTitle>

      <RuleInstruction type="action">
        <Translate
          pt="Analise os novos conceitos! Você pode anotar o que você achar que é o significado de cada um. Aperte o botão quando estiver pronto."
          en="Review the new concepts! You can jot down what you think each one means. Press the button when you're ready."
        />
      </RuleInstruction>

      <SpaceContainer>
        <SendButton
          type="primary"
          size="large"
          onClick={onMakeMeReady}
        >
          <Translate
            pt="Pronto"
            en="Ready"
          />
        </SendButton>
      </SpaceContainer>

      <Flex
        justify="center"
        align="center"
        wrap="wrap"
        gap={12}
        className="my-2"
      >
        {concepts.map((concept) => (
          <ConceptCreationBlock
            key={concept.id}
            players={players}
            items={items}
            concept={concept}
            user={user}
            className={concept.age === round.current ? 'new-concept-block' : ''}
          />
        ))}
      </Flex>
    </Step>
  );
}
