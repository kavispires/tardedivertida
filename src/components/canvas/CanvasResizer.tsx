// Design Resources
import { Slider } from 'antd';
// State & Hooks
import { useGlobalState } from 'hooks';
// Components
import { Translate } from 'components';

/**
 * Floating canvas resizer bar positioned on the top-left of the page
 * @returns
 */
export const CanvasResizer = () => {
  const [canvasSize, setCanvasSize] = useGlobalState('canvasSize');

  return (
    <div className="canvas-resizer">
      <div className="canvas-resizer__label">
        <Translate pt="Tamanho das Images" en="Image Size" />
      </div>
      <Slider
        className="canvas-resizer__slider"
        value={canvasSize ?? 100}
        min={150}
        max={500}
        step={50}
        onChange={setCanvasSize}
      />
    </div>
  );
};
