// AntDesign Resources
import { Badge } from 'antd';
// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
// Components
import { CanvasSVG } from 'components/canvas';
import { Translate } from 'components/language';
import { Instruction } from 'components/text';
import { WinningCount } from '../WinningCount';

export function ResultRetratoFalado({ track, winningValues, winningTeam }: ResultComponentProps) {
  const width = useCardWidth(winningValues.length + 1, {
    gap: 9,
    minWidth: 80,
    maxWidth: 200,
    containerId: 'results-values',
  });

  const winningArtworks: PlainObject[] = track.data.options.filter((option: PlainObject) => {
    return winningValues.includes(option.playerId);
  });

  return (
    <>
      <WinningCount>{winningTeam.length}</WinningCount>
      <Instruction>
        <Translate pt="O monstro escolhido foi" en="The best monster was" />:
      </Instruction>
      <div className="track-result-values__cards">
        {winningArtworks.map((value) => (
          <Badge key={value.playerId} count={winningTeam.length} color="#faad14">
            <div className="track-result-values__text-value">
              <CanvasSVG drawing={value.drawing} width={width} className="a-drawing" />
            </div>
          </Badge>
        ))}
      </div>
    </>
  );
}
