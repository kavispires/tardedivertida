import { useState } from 'react';
// Ant Design Resources
import { PlusCircleOutlined } from '@ant-design/icons';
import { Button, Flex } from 'antd';
// Types
import type { GameRound } from 'types/game';
import type { GamePlayers, GamePlayer } from 'types/player';
import type { Item } from 'types/tdr';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
import { useMock } from 'hooks/useMock';
// Components
import { SendButton } from 'components/buttons';
import { ItemCard } from 'components/cards/ItemCard';
import { Translate } from 'components/language';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { Step } from 'components/steps';
import { RuleInstruction, StepTitle } from 'components/text';
// Internal
import type { Concept, SubmitConceptsPayload } from './utils/types';
import { mockConcept } from './utils/mock';
import { ItemsBoard } from './components/ItemsBoard';
import { ConceptCreationBlock } from './components/ConceptCreationBlock';
import { ConceptsCollapse } from './components/ConceptsCollapse';

type StepCreateConceptsProps = {
  players: GamePlayers;
  user: GamePlayer;
  basicConcepts: Concept[];
  concepts: Concept[];
  maxProposals: number;
  round: GameRound;
  items: Dictionary<Item>;
  onSubmitConcepts: (payload: SubmitConceptsPayload) => void;
};

export function StepCreateConcepts({
  players,
  user,

  items,
  maxProposals,
  round,
  concepts,
  onSubmitConcepts,
}: StepCreateConceptsProps) {
  const { dualTranslate } = useLanguage();

  useMock(() =>
    onSubmitConcepts({ proposedConcepts: mockConcept(user, concepts, items, maxProposals, round.current) }),
  );

  const userProposedConcepts = user.proposedConcepts || [];
  const [proposedConcepts, setProposedConcepts] = useState<Concept[]>(userProposedConcepts);
  const [activeConceptId, setActiveConceptId] = useState<string | null>(null);
  const isLatestConceptIncomplete =
    proposedConcepts.length > 0 &&
    !proposedConcepts[proposedConcepts.length - 1].meaning &&
    proposedConcepts[proposedConcepts.length - 1].itemsIds.length >= 2;

  const activeConcept = proposedConcepts.find((c) => c.id === activeConceptId);

  const totalNewConcepts = proposedConcepts.length - userProposedConcepts.length;

  const areAllNewComplete = proposedConcepts.every(
    (concept) => concept.meaning && concept.itemsIds.length >= 2 && concept.itemsIds.length <= 10,
  );

  const onNewConcept = () => {
    const id = `c-${round.current}-${user.id}-${Date.now()}`;
    setProposedConcepts((prev) => [
      ...prev,
      {
        id,
        key: '',
        soundId: '',
        itemsIds: [],
        meaning: '',
        syllable: { pt: '?', en: '?' },
        playerId: user.id,
        age: round.current,
        type: 'custom',
      },
    ]);
    setActiveConceptId(id);
  };

  const onActivateConcept = (conceptId: string | null) => {
    if (activeConceptId === conceptId) {
      setActiveConceptId(null);
    } else {
      setActiveConceptId(conceptId);
    }
  };

  const onUpdateConcept = (updatedConcept: Concept) => {
    setProposedConcepts((prev) =>
      prev.map((concept) => (concept.id === updatedConcept.id ? updatedConcept : concept)),
    );
  };

  const onAddItemToActiveConcept = (itemId: string) => {
    if (activeConceptId === null) return;

    setProposedConcepts((prev) => {
      const updatedConcepts = [...prev];
      const concept = updatedConcepts.find((c) => c.id === activeConceptId);
      if (!concept) return prev;

      if (concept.itemsIds.includes(itemId)) {
        concept.itemsIds = concept.itemsIds.filter((id) => id !== itemId);
      } else {
        concept.itemsIds.push(itemId);
      }
      return updatedConcepts;
    });
  };

  const onDeleteConcept = (conceptId: string) => {
    setProposedConcepts((prev) => prev.filter((concept) => concept.id !== conceptId));
    if (activeConceptId === conceptId) {
      setActiveConceptId(null);
    }
  };

  return (
    <Step fullWidth>
      <StepTitle>
        <Translate pt={<>Criação de Conceitos</>} en={<>Concept Creation</>} />
      </StepTitle>

      <RuleInstruction type="action">
        <Translate
          en={
            <>
              Select 2-10 items to create a concept, then propose a meaning for it. <br />
              The meaning is secret to you and will be only revealed at the end of the game.
              <br />A syllable/sound will be assigned to the concept, which you can use to refer to it later.
              <br />
              You can create up to {maxProposals} concepts this round.
            </>
          }
          pt={
            <>
              Selecione 3-10 itens para criar um conceito e proponha um significado para ele. <br />O
              significado é secreto para você e só será revelado no final do jogo.
              <br />
              Uma sílaba/som será atribuída ao conceito que você usará para se referir a ele mais tarde.
              <br />
              Você pode criar até {maxProposals} conceitos nesta rodada.
            </>
          }
        />
      </RuleInstruction>

      <ItemsBoard
        items={items}
        selectedItems={activeConcept?.itemsIds}
        onSelectItem={onAddItemToActiveConcept}
        currentAge={round.current}
      />

      <SpaceContainer className="new-concepts-container">
        <Flex wrap="wrap" gap={12} align="center">
          {proposedConcepts.map((concept) => (
            <ConceptCreationBlock
              players={players}
              concept={concept}
              key={concept.id}
              onChange={onUpdateConcept}
              items={items}
              showMeaning
              toggleEditing={onActivateConcept}
              isEditing={activeConceptId === concept.id}
              onDelete={!userProposedConcepts.includes(concept.id) ? onDeleteConcept : undefined}
            />
          ))}
          <Button
            disabled={totalNewConcepts >= maxProposals || isLatestConceptIncomplete}
            onClick={onNewConcept}
            icon={<PlusCircleOutlined />}
          >
            <Translate pt="Criar Conceito" en="Create Concept" />
          </Button>
        </Flex>
      </SpaceContainer>

      {proposedConcepts.length - (user.proposedConcepts?.length ?? 0) > 0 && (
        <SpaceContainer>
          <SendButton
            size="large"
            disabled={!!activeConceptId || !areAllNewComplete}
            onClick={() => onSubmitConcepts({ proposedConcepts })}
          >
            <Translate pt="Enviar Conceitos" en="Send Concepts" />
          </SendButton>
        </SpaceContainer>
      )}

      <RuleInstruction type="tip">
        <Translate
          pt={
            'Na próxima fase do jogo, você terá que dar nome a uma dessa coisas abaixo, portanto, tente criar conceitos que te ajude nessa tarefa.'
          }
          en={
            'In the next phase of the game, you will have to name one of the things below, so try to create concepts that help you with this task.'
          }
        />
        <Flex justify="center" align="center" className="mt-2" gap={12}>
          {user.hand.map((item: Item) => (
            <ItemCard key={item.id} itemId={item.id} title={dualTranslate(item.name)} width={48} />
          ))}
        </Flex>
        <Translate
          pt="Sugestões de conceitos: animal, vôo, cor, pequeno, imaginário, natural, peludo, afiado, etc."
          en="Concept suggestions: animal, flight, color, small, imaginary, natural, furry, sharp, etc."
        />
      </RuleInstruction>

      {concepts.length > 0 && (
        <ConceptsCollapse user={user} players={players} items={items} concepts={concepts} />
      )}
    </Step>
  );
}
