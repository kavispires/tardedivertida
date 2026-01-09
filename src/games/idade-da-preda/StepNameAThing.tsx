import { sample } from 'lodash';
import { useMemo, useState } from 'react';
// Ant Design Resources
import { RollbackOutlined } from '@ant-design/icons';
import { Button, Divider, Flex } from 'antd';
// Types
import type { GameRound } from 'types/game';
import type { GamePlayers, GamePlayer } from 'types/player';
import type { Item } from 'types/tdr';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
import { useMock } from 'hooks/useMock';
// Components
import { SendButton, TransparentButton } from 'components/buttons';
import { ItemCard } from 'components/cards/ItemCard';
import { Translate } from 'components/language';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { Step, type StepProps } from 'components/steps';
import { RuleInstruction, StepTitle, TextHighlight } from 'components/text';
// Internal
import type { Concept, SubmitNamePayload } from './utils/types';
import { useSpriteWidth } from './utils/useSpriteWidth';
import { mockName } from './utils/mock';
import { ConceptsCollapse } from './components/ConceptsCollapse';

type StepNameAThingProps = {
  players: GamePlayers;
  user: GamePlayer;
  basicConcepts: Concept[];
  concepts: Concept[];
  round: GameRound;
  items: Dictionary<Item>;
  pool: Item[];
  onSubmitName: (payload: SubmitNamePayload) => void;
} & Pick<StepProps, 'announcement'>;

export function StepNameAThing({
  user,
  players,
  announcement,
  items,
  concepts,
  basicConcepts,
  pool,
  onSubmitName,
}: StepNameAThingProps) {
  const { language, dualTranslate } = useLanguage();
  const hand: Item[] = user.hand ?? [];
  const itemWidth = useSpriteWidth();
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [newName, setNewName] = useState<string[]>([]);

  const addSyllableToName = (conceptId: string) => {
    setNewName((prev) => [...prev, conceptId]);
  };

  const onSendName = () => {
    if (!selectedItem || !newName) return;
    onSubmitName({
      itemId: selectedItem.id,
      name: getName(concepts, basicConcepts, newName, language),
      conceptsIds: newName,
    });
  };

  // Dev only: Mock action to simulate name submission
  useMock(() => {
    const mockedNamePayload = mockName(basicConcepts, concepts, language);
    onSubmitName({
      name: mockedNamePayload.name,
      itemId: sample(hand)?.id || '',
      conceptsIds: mockedNamePayload.conceptsIds,
    });
  });

  return (
    <Step
      fullWidth
      announcement={announcement}
    >
      <StepTitle>
        <Translate
          pt={<>Nomeie um Item</>}
          en={<>Name an Item</>}
        />
      </StepTitle>

      <RuleInstruction type="action">
        <Translate
          pt={
            <>
              Escolha um dos seus três itens e crie um nome para ele usando as sílabas disponíveis (clique na
              sílaba para adicionar).
              <br />
              Seu nome deve ter pelo menos duas sílabas.
            </>
          }
          en={
            <>
              Choose one of your three items and create a name for it using the available syllables (click on
              the syllable to add it).
              <br />
              Your name must have at least two syllables.
            </>
          }
        />
      </RuleInstruction>

      <SpaceContainer className="mt-4 contained">
        <Flex
          justify="center"
          align="center"
          wrap="wrap"
          gap={6}
          className="mb-2"
        >
          {hand.map((item) => (
            <TransparentButton
              key={item.id}
              onClick={() => setSelectedItem(item)}
              activeClass="idp-selected"
              active={selectedItem?.id === item.id}
            >
              <ItemCard
                key={item.id}
                itemId={item.id}
                width={itemWidth}
                title={dualTranslate(item.name)}
              />
            </TransparentButton>
          ))}
        </Flex>
        <Divider orientation="vertical" />

        {newName.length > 0 && (
          <Flex
            justify="center"
            align="center"
            wrap="wrap"
            gap={6}
          >
            <TextHighlight className="idp-item-name">
              <ItemName
                concepts={concepts}
                basicConcepts={basicConcepts}
                name={newName}
              />
            </TextHighlight>
            <Button
              icon={<RollbackOutlined />}
              onClick={() => setNewName((p) => p.slice(0, -1))}
            />
          </Flex>
        )}

        <Divider orientation="vertical" />

        <SendButton
          size="large"
          disabled={!selectedItem || newName.length < 2}
          onClick={onSendName}
        >
          <Translate
            pt="Enviar Nome"
            en="Send Name"
          />
        </SendButton>
      </SpaceContainer>

      <ConceptsCollapse
        user={user}
        players={players}
        items={items}
        basicConcepts={basicConcepts}
        concepts={concepts}
        onSelectConcept={addSyllableToName}
        pool={pool}
        defaultActiveKey={['basic-concepts', 'concepts', 'pool']}
      />
    </Step>
  );
}

type ItemNameProps = {
  concepts: Concept[];
  basicConcepts: Concept[];
  name: string[];
};
function ItemName({ concepts, basicConcepts, name }: ItemNameProps) {
  const { language } = useLanguage();

  const result = useMemo(() => {
    return getName(concepts, basicConcepts, name, language);
  }, [name, concepts, basicConcepts, language]);

  return <>{result}</>;
}

const getName = (concepts: Concept[], basicConcepts: Concept[], name: string[], language: Language) => {
  return name
    .map(
      (id) =>
        concepts.find((c) => c.id === id)?.syllable[language] ||
        basicConcepts.find((c) => c.id === id)?.syllable[language],
    )
    .join('');
};
