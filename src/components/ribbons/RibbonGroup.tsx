import { Ribbon } from './Ribbon';

type RibbonGroupProps = {
  labels: string[];
};

export function RibbonGroup({ labels }: RibbonGroupProps) {
  return (
    <div className="ribbon-group ribbon--absolute">
      {labels.length > 0 &&
        labels.map((label) => (
          <Ribbon
            key={label}
            label={label.length > 0 ? label.charAt(label.length - 1) : label}
            position="static"
          />
        ))}
    </div>
  );
}
