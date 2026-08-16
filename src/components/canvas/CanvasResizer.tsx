// Ant Design Resources
import { DragOutlined } from '@ant-design/icons';
import { Flex, Slider } from 'antd';
// Hooks
import { useGlobalLocalStorage } from '@hooks/useGlobalLocalStorage';
// Components
import { FixedMenuButton } from '@components/buttons/FixedMenuButton';
import { Translate } from '@components/language/Translate';
// Sass
import styles from './CanvasResizer.module.scss';

const labelText = (
  <Translate
    pt="Tamanho das Artes"
    en="Art Size"
  />
);

/**
 * Fixed Menu Button for resizing canvas
 * @deprecated Use CanvasResizerButton instead
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

export const CanvasResizerButton = () => {
  const [canvasSize, setCanvasSize] = useGlobalLocalStorage('canvasSize');

  return (
    <Flex
      align="center"
      gap={3}
    >
      <span>{labelText}:</span>
      <div style={{ width: 96 }}>
        <Slider
          value={canvasSize ?? 100}
          min={150}
          max={500}
          step={50}
          onChange={setCanvasSize}
        />
      </div>
    </Flex>
  );
};
