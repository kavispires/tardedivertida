// Utils
import { getColorFromLetter } from 'utils/helpers';

type RibbonProps = {
  label: string;
};

export function Ribbon({ label }: RibbonProps) {
  return (
    <div className="ribbon">
      <div
        className={`ribbon__content ribbon__content--${label} color-background--${getColorFromLetter(label)}`}
      >
        {label}
      </div>
    </div>
  );
}
