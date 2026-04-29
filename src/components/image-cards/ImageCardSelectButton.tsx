import clsx from 'clsx';
// Ant Design Resources
import { UpCircleOutlined } from '@ant-design/icons';
import { Button } from 'antd';
// Components
import { Translate } from 'components/language/Translate';

type ImageCardSelectButtonProps = {
  /**
   * The id of the image
   */
  cardId: UID;
  /**
   * Function to call when the button is clicked
   * @param id The id of the image
   */
  onClick: (id: UID) => void;
  /**
   * If the card is currently selected
   */
  isSelected?: boolean;
  /**
   * Optional custom class name
   */
  className?: string;
  /**
   * Select button custom label
   */
  selectLabel?: string;
  /**
   * Deselect button custom label
   */
  deselectLabel?: string;
  /**
   * Flag indicating whether the button is standalone (not part of a ImageCardButton container)
   */
  standalone?: boolean;
};

/**
 * Toggle button component for selecting and deselecting image cards with customizable labels
 */
export function ImageCardSelectButton({
  onClick,
  cardId,
  selectLabel,
  deselectLabel,
  isSelected = false,
  standalone = false,
  className,
}: ImageCardSelectButtonProps) {
  return (
    <Button
      shape="round"
      size="small"
      ghost={!isSelected}
      className={clsx('image-card-select-button', { standalone }, className)}
      onClick={() => onClick(cardId)}
    >
      <UpCircleOutlined />
      {isSelected ? (
        <Translate
          pt="Desmarcar"
          en="Deselect"
          custom={deselectLabel}
        />
      ) : (
        <Translate
          pt="Selecionar"
          en="Select"
          custom={selectLabel}
        />
      )}
      <UpCircleOutlined />
    </Button>
  );
}
