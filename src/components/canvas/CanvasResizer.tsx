// Ant Design Resources
import { Slider } from 'antd';
import { DragOutlined } from '@ant-design/icons';
// State & Hooks
import { useGlobalLocalStorage } from 'hooks/useGlobalLocalStorage';
// Components
import { FixedMenuButton } from 'components/buttons';
import { Translate } from 'components/language';

/**
 * Fixed Menu Button for resizing canvas
 */
export const CanvasResizer = () => {
  const [canvasSize, setCanvasSize] = useGlobalLocalStorage('canvasSize');

  return (
    <FixedMenuButton
      type="popover"
      position={1}
      icon={<DragOutlined />}
      label={labelText}
      content={
        <div className="canvas-resizer">
          <div className="canvas-resizer__label">{labelText}</div>
          <Slider
            className="canvas-resizer__slider"
            value={canvasSize ?? 100}
            min={150}
            max={500}
            step={50}
            onChange={setCanvasSize}
          />
        </div>
      }
    />
  );
};

const labelText = <Translate pt="Tamanho das Artes" en="Art Size" />;
