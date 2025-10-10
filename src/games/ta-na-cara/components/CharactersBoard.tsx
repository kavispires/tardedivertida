import clsx from 'clsx';
// Ant Design Resources
import { Image, Popconfirm } from 'antd';
// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
import { useLanguage } from 'hooks/useLanguage';
import { useLoading } from 'hooks/useLoading';
// Components
import { TransparentButton } from 'components/buttons';
import { ImageCard } from 'components/image-cards';
import { DualTranslate } from 'components/language';
// Internal
import type { CharactersDictionary } from '../utils/types';

type CharactersBoardProps = {
  charactersIds: CardId[];
  charactersDict: CharactersDictionary;
  userCharacterId: CardId;
  onCardClick?: GenericFunction;
  historyEntry?: PlayerId[];
};

export function CharactersBoard({
  charactersDict,
  charactersIds,
  userCharacterId,
  onCardClick,
  historyEntry = [],
}: CharactersBoardProps) {
  const { language, translate } = useLanguage();
  const { isLoading } = useLoading();
  const cardWidth = useCardWidth(10, {
    gap: 16,
    minWidth: 80,
    maxWidth: 100,
    margin: 16,
  });

  if (onCardClick) {
    return (
      <div className="characters-table" style={{ width: `${cardWidth * 6}px` }}>
        {charactersIds.map((characterId) => {
          const character = charactersDict[characterId];
          const name = character.name[language];

          const unavailable = historyEntry.includes(character.id);
          const revealed = character?.revealed;
          const ownCharacter = userCharacterId === character.id;

          return (
            <Popconfirm
              key={character.id}
              title={translate(
                `Tem certeza que quer escolher ${name}?`,
                `Are you sure you want to choose ${name}?`,
              )}
              onConfirm={() => onCardClick({ characterId: character.id })}
              okText={translate('Sim', 'Yes')}
              cancelText={translate('Não', 'No')}
              disabled={unavailable || revealed || ownCharacter || isLoading}
            >
              <TransparentButton
                className="characters-table__character characters-table__character-button"
                disabled={unavailable || revealed || ownCharacter || isLoading}
              >
                <ImageCard
                  cardId={revealed ? 'us-00' : character.id}
                  className={clsx(
                    'characters-table__character-image',
                    userCharacterId === character.id && 'characters-table__character-image--active',
                    (unavailable || revealed || ownCharacter) &&
                      'characters-table__character-image--disabled',
                  )}
                  cardWidth={cardWidth - 16}
                  preview={false}
                />
                {!unavailable && <div className="characters-table__character-name">{name}</div>}
              </TransparentButton>
            </Popconfirm>
          );
        })}
      </div>
    );
  }

  return (
    <div className="characters-table" style={{ width: `${(cardWidth + 16) * 6}px` }}>
      <Image.PreviewGroup>
        {charactersIds.map((characterId) => {
          const character = charactersDict[characterId];
          return (
            <div className="characters-table__character" key={character.id}>
              <ImageCard
                cardId={character?.revealed ? 'us-00' : character.id}
                previewImageId={character.id}
                className={clsx(
                  'characters-table__character-image',
                  userCharacterId === character.id && 'characters-table__character-image--active',
                )}
                cardWidth={cardWidth}
              />
              {!character?.revealed && (
                <div className="characters-table__character-name">
                  <DualTranslate>{character.name}</DualTranslate>
                </div>
              )}
            </div>
          );
        })}
      </Image.PreviewGroup>
    </div>
  );
}
