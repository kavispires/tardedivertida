import { CanvasSVG } from 'components/canvas';
import { WarningSignBackgroundMask } from './WarningSignBackgroundMask';

type WarningDrawingProps = {
  drawing: string;
  width: number;
};

export function WarningDrawing({ drawing, width }: WarningDrawingProps) {
  return (
    <div className="sda-alert-sign">
      <WarningSignBackgroundMask style={{ width }} className="sda-alert-sign__mask" />
      <CanvasSVG drawing={drawing} width={width} className="sda-alert-sign__canvas" />
    </div>
  );
}
