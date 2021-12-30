// Utils
import { getColorFromLetter } from '../../utils/helpers';
import { SEPARATOR } from '../../utils/constants';

type RibbonProps = {
  cardEntryId: string;
};

function Ribbon({ cardEntryId }: RibbonProps) {
  const [, , letter] = cardEntryId.split(SEPARATOR);
  return (
    <div className="a-ribbon">
      <div
        className={`a-ribbon__content a-ribbon__content--${letter} color-background--${getColorFromLetter(
          letter
        )}`}
      >
        {letter}
      </div>
    </div>
  );
}

export default Ribbon;
