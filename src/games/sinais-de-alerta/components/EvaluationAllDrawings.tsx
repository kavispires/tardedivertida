// Ant Design Resources
import { Typography } from 'antd';
// Types
import { GamePlayers } from 'types/player';
import { TextCard } from 'types/tdr';
// Icons
import { CheckMarkIcon } from 'icons/CheckMarkIcon';
// Components
import { AvatarName, IconAvatar } from 'components/avatars';
import { TransparentButton } from 'components/buttons';
import { Container } from 'components/general/Container';
import { Translate } from 'components/language';
// Internal
import { DrawingEntry } from '../utils/types';
import { WarningDrawing } from './WarningDrawing';
import { useGlobalLocalStorage } from 'hooks/useGlobalLocalStorage';

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
    <Container
      title={<Translate pt="Desenhos" en="Drawings" />}
      contentProps={{ className: 'space-container' }}
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
            {isFullyGuessed && <IconAvatar icon={<CheckMarkIcon />} className="sda-word-button__matched" />}
            <AvatarName player={players[drawing.playerId]} />
            <WarningDrawing drawing={drawing.drawing} width={canvasSize} />
            <Typography.Text code className="uppercase">
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
    </Container>
  );
}
