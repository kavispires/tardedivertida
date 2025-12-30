import clsx from 'clsx';
import { useState } from 'react';
// Ant Design Resources
import { DeleteOutlined, EditOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, Card, Flex, Input, Tooltip } from 'antd';
// Types
import type { GamePlayer, GamePlayers } from 'types/player';
import type { Item } from 'types/tdr';
// Hooks
import { useCache } from 'hooks/useCache';
import { useLanguage } from 'hooks/useLanguage';
// Components
import { SpeakButton } from 'components/audio/SpeakButton';
import { PlayerAvatar } from 'components/avatars';
import { TransparentButton } from 'components/buttons';
import { DivButton } from 'components/buttons/DivButton';
import { ItemCard } from 'components/cards/ItemCard';
import { Popconfirm } from 'components/general/Popconfirm';
import { DualTranslate } from 'components/language';
// Internal
import type { Concept } from '../utils/types';
import { useSpriteWidth } from '../utils/useSpriteWidth';

type ConceptCreationBlockProps = {
  players: GamePlayers;
  user?: GamePlayer;
  items: Dictionary<Item>;
  concept: Concept;
  onChange?: (concept: Concept) => void;
  showMeaning?: boolean;
  isEditing?: boolean;
  toggleEditing?: (conceptId: string | null) => void;
  onDelete?: (conceptId: string) => void;
  onSelect?: (conceptId: string) => void;
  className?: string;
};

export function ConceptCreationBlock({
  players,
  user,
  concept,
  onChange,
  showMeaning,
  isEditing,
  toggleEditing,
  onDelete,
  onSelect,
  className,
}: ConceptCreationBlockProps) {
  const itemWidth = useSpriteWidth();
  const { dualTranslate } = useLanguage();

  const [meaning, setMeaning] = useState(concept.meaning);

  const handleSave = () => {
    onChange?.({ ...concept, meaning });
    toggleEditing?.(null);
  };

  const onRemoveItem = (itemId: string) => {
    const updatedConcept = {
      ...concept,
      itemsIds: concept.itemsIds.filter((id) => id !== itemId),
    };
    onChange?.(updatedConcept);
  };

  const placeholderItems = Array.from({ length: 10 - concept.itemsIds.length }, (_, index) => ({
    id: `placeholder-${index}`,
  }));

  return (
    <Card
      size="small"
      className={clsx('concept-block', className, {
        'concept-block--editing': isEditing,
      })}
      style={{ width: itemWidth * 3.25 }}
    >
      <Flex className="concept-block__header" justify="space-between" align="center">
        <div className="concept-block__sound">
          <SpeakButton text={concept.syllable} />
          <DivButton
            className={clsx('concept-block__syllable', {
              'concept-block__syllable--button': !!onSelect,
            })}
            onClick={() => onSelect?.(concept.id)}
          >
            <DualTranslate>{concept.syllable}</DualTranslate>
          </DivButton>
        </div>
        <Tooltip
          title={dualTranslate({
            en: `Created by ${players[concept.playerId].name}`,
            pt: `Criado por ${players[concept.playerId].name}`,
          })}
        >
          <PlayerAvatar avatarId={players[concept.playerId].avatarId} size="small" />
        </Tooltip>
      </Flex>
      {showMeaning && (
        <Input
          defaultValue={concept.meaning}
          readOnly={!isEditing}
          placeholder={dualTranslate({ en: 'Write the meaning here', pt: 'Escreva o significado aqui' })}
          onChange={(e) => setMeaning(e.target.value)}
          variant={isEditing ? 'outlined' : 'filled'}
        />
      )}
      <Flex wrap="wrap" gap={6} className="my-2">
        {concept.itemsIds.map((itemId) => (
          <TransparentButton
            key={itemId}
            onClick={isEditing ? () => onRemoveItem(itemId) : undefined}
            className="idade-transparent-button"
          >
            <ItemCard width={itemWidth / 2} itemId={itemId} />
          </TransparentButton>
        ))}
        {!!toggleEditing &&
          placeholderItems.map((item) => (
            <div key={item.id} className="concept-block__placeholder-item">
              <ItemCard width={itemWidth / 2} itemId="0" />
            </div>
          ))}
      </Flex>
      {!!toggleEditing && (
        <Flex justify="flex-end" gap={6}>
          {isEditing ? (
            <>
              <Popconfirm
                title={dualTranslate({
                  en: 'Are you sure you want to delete this concept?',
                  pt: 'Tem certeza de que deseja deletar este conceito?',
                })}
                onConfirm={() => onDelete?.(concept.id)}
              >
                <Button type="dashed" danger size="small" disabled={!onDelete}>
                  <DeleteOutlined />
                </Button>
              </Popconfirm>
              <Button type="primary" size="small" onClick={handleSave}>
                <SaveOutlined />
              </Button>
            </>
          ) : (
            <Tooltip title={dualTranslate({ en: 'Edit Concept', pt: 'Editar Conceito' })}>
              <Button type="dashed" size="small" onClick={() => toggleEditing?.(concept.id)}>
                <EditOutlined />
              </Button>
            </Tooltip>
          )}
        </Flex>
      )}
      {!onChange && <Note concept={concept} userId={user?.id} />}
    </Card>
  );
}

type NoteProps = {
  concept: Concept;
  userId?: PlayerId;
};

function Note({ concept, userId }: NoteProps) {
  const { dualTranslate } = useLanguage();
  const { cache, setCache } = useCache();

  const note = cache[concept.id] ?? '';

  const isUserConcept = userId === concept.playerId;
  return (
    <Input
      placeholder={dualTranslate({ en: 'Notes', pt: 'Anotações' })}
      className="concept-block__notes"
      size="small"
      value={isUserConcept ? concept.meaning : note}
      onChange={(e) => setCache({ ...cache, [concept.id]: e.target.value })}
      disabled={isUserConcept}
    />
  );
}
