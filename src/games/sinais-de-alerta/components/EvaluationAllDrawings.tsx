// Ant Design Resources
import { Typography } from 'antd';
// Types
import type { GamePlayers } from 'types/player';
import type { TextCard } from 'types/tdr';
// Hooks
import { useGlobalLocalStorage } from 'hooks/useGlobalLocalStorage';
// Icons
import { CheckMarkIcon } from 'icons/CheckMarkIcon';
// Components
import { PlayerAvatarName, IconAvatar } from 'components/avatars';
import { TransparentButton } from 'components/buttons';
import { Translate } from 'components/language';
import { TitledContainer } from 'components/layout/TitledContainer';
// Internal
import type { DrawingEntry } from '../utils/types';
import { WarningDrawing } from './WarningDrawing';

type EvaluationAllDrawingsProps = {
  players: GamePlayers;
  cards: Dictionary<TextCard>;
  drawings: DrawingEntry[];
  onSelect: (cardId: CardId) => void;
  subjectGuesses: StringDictionary;
  descriptorGuesses: StringDictionary;
  gameLanguage: Language;
  activeItem: CardId;
};

export function EvaluationAllDrawings({
  players,
  cards,
  drawings,
  onSelect,
  subjectGuesses,
  descriptorGuesses,
  gameLanguage,
  activeItem,
}: EvaluationAllDrawingsProps) {
  const [canvasSize] = useGlobalLocalStorage('canvasSize');

  return (
    <TitledContainer
      title={
        <Translate
          pt="Desenhos"
          en="Drawings"
        />
      }
      contentProps={{ className: 'div-container' }}
      className="contained"
    >
      {drawings.map((drawing) => {
        const subject = cards?.[subjectGuesses?.[drawing.playerId]]?.text;
        const descriptor = cards?.[descriptorGuesses?.[drawing.playerId]]?.text;
        const isFullyGuessed = subject && descriptor;

        return (
          <TransparentButton
            key={drawing.playerId}
            style={{ width: canvasSize }}
            onClick={() => onSelect(drawing.playerId)}
            className="sda-word-button"
            active={drawing.playerId === activeItem}
            activeClass="sda-word-button--active"
          >
            <span className="sda-word-button__avatar">
              {isFullyGuessed && (
                <IconAvatar
                  icon={<CheckMarkIcon />}
                  className="sda-word-button__matched"
                />
              )}
              <PlayerAvatarName player={players[drawing.playerId]} />
            </span>
            <WarningDrawing
              drawing={drawing.drawing}
              width={canvasSize}
            />
            <Typography.Text
              code
              className="uppercase"
            >
              {gameLanguage === 'pt' ? (
                <>
                  {subject ?? '?'} {descriptor ?? '?'}
                </>
              ) : (
                <>
                  {descriptor ?? '?'} {subject ?? '?'}
                </>
              )}
            </Typography.Text>
          </TransparentButton>
        );
      })}
    </TitledContainer>
  );
}
