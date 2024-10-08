// Ant Design Resources
import { UpCircleOutlined } from '@ant-design/icons';
import { Button } from 'antd';
// Components
import { Translate } from 'components/language';

type ImageCardSelectButtonProps = {
  isSelected?: boolean;
  cardId: ImageCardId;
  onClick: GenericFunction;
  /**
   * Optional custom class name
   */
  className?: string;
  selectLabel?: string;
  deselectLabel?: string;
};

export function ImageCardSelectButton({
  onClick,
  cardId,
  selectLabel,
  deselectLabel,
  isSelected = false,
}: ImageCardSelectButtonProps) {
  return (
    <Button
      shape="round"
      size="small"
      ghost={!isSelected}
      className="image-card-select-button"
      onClick={() => onClick(cardId)}
    >
      <UpCircleOutlined />
      {isSelected ? (
        <Translate pt="Desmarcar" en="Deselect" custom={deselectLabel} />
      ) : (
        <Translate pt="Selecionar" en="Select" custom={selectLabel} />
      )}
      <UpCircleOutlined />
    </Button>
  );
}
