import type { ReactNode } from 'react';
// Ant Design Resources
import { WarningOutlined } from '@ant-design/icons';
// Utils
import { getColorFromLetter } from 'utils/helpers';
// Components
import { Card } from 'components/cards';

type ArteRuimCardProps = {
  /**
   * The text of the card
   */
  text?: ReactNode;
  /**
   * The level of the card displayed as dots in the footer
   */
  level: number;
  /**
   * The header of the card. Default: X
   */
  header?: string;
};

/**
 * This is the Card component
 * @param props {object}
 * @returns
 */
export const ArteRuimCard = ({ text, level, header = 'X' }: ArteRuimCardProps) => {
  return (
    <Card
      color={getColorFromLetter(header)}
      header={header}
      size="medium"
      footer={Array(level).fill('•').join('')}
    >
      {text ?? <WarningOutlined />}
    </Card>
  );
};
