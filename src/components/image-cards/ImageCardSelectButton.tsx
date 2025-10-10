import clsx from 'clsx';
// Ant Design Resources
import { UpCircleOutlined } from '@ant-design/icons';
import { Button } from 'antd';
// Components
import { Translate } from 'components/language';

type ImageCardSelectButtonProps = {
  /**
   * The ID of the card
   */
  cardId: ImageCardId;
  /**
   * Callback function to handle card selection
   * @param cardId The ID of the card
   */
  onClick: (cardId: ImageCardId) => void;
  /**
   * Flag indicating whether the card is selected
   */
  isSelected?: boolean;
  /**
   * Optional custom class name
   */
  className?: string;
  /**
   * Label for the select button
   */
  selectLabel?: string;
  /**
   * Label for the deselect button
   */
  deselectLabel?: string;
  /**
   * Flag indicating whether the button is standalone (not part of a ImageCardButton container)
   */
  standalone?: boolean;
};

export function ImageCardSelectButton({
  onClick,
  cardId,
  selectLabel,
  deselectLabel,
  isSelected = false,
  standalone = false,
}: ImageCardSelectButtonProps) {
  return (
    <Button
      shape="round"
      size="small"
      ghost={!isSelected}
      className={clsx('image-card-select-button', { standalone })}
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
