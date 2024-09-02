import { Typography } from 'antd';
import { DrawingEntry } from '../utils/types';
import { TransparentButton } from 'components/buttons';
import { WarningDrawing } from './WarningDrawing';
import { Container } from 'components/general/Container';
import { Translate } from 'components/language';
import { GamePlayers } from 'types/player';
import { AvatarName, IconAvatar } from 'components/avatars';
import { CheckMarkIcon } from 'icons/CheckMarkIcon';
import { TextCard } from 'types/tdr';

type EvaluationAllDrawingsProps = {
  players: GamePlayers;
  cards: Dictionary<TextCard>;
  drawings: DrawingEntry[];
  onSelect: (cardId: CardId) => void;
  width: number;
  subjectGuesses: StringDictionary;
  descriptorGuesses: StringDictionary;
  gameLanguage: Language;
};

export function EvaluationAllDrawings({
  players,
  cards,
  drawings,
  onSelect,
  width,
  subjectGuesses,
  descriptorGuesses,
  gameLanguage,
}: EvaluationAllDrawingsProps) {
  return (
    <Container
      title={<Translate pt="Desenhos" en="Drawings" />}
      contentProps={{ className: 'space-container' }}
    >
      {drawings.map((drawing) => {
        const subject = cards?.[subjectGuesses?.[drawing.playerId]]?.text;
        const descriptor = cards?.[descriptorGuesses?.[drawing.playerId]]?.text;
        const isFullyGuessed = subject && descriptor;

        return (
          <TransparentButton
            key={drawing.playerId}
            style={{ width }}
            onClick={() => onSelect(drawing.playerId)}
            className="sda-word-button"
          >
            {isFullyGuessed && <IconAvatar icon={<CheckMarkIcon />} className="sda-word-button__matched" />}
            <AvatarName player={players[drawing.playerId]} />
            <WarningDrawing drawing={drawing.drawing} width={width} />
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
