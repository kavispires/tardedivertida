// Ant Design Resources
import { DragOutlined } from '@ant-design/icons';
import { Slider } from 'antd';
// Hooks
import { useGlobalLocalStorage } from 'hooks/useGlobalLocalStorage';
// Components
import { FixedMenuButton } from 'components/buttons';
import { Translate } from 'components/language';
// Sass
import styles from './CanvasResizer.module.scss';

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
        <div className={styles.canvasResizer}>
          <div className={styles.label}>{labelText}</div>
          <Slider
            className={styles.slider}
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

const labelText = (
  <Translate
    pt="Tamanho das Artes"
    en="Art Size"
  />
);
