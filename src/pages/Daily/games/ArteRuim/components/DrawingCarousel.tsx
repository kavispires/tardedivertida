// Ant Design Resources
import { Carousel } from 'antd';
// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
// Components
import { CanvasSVG } from 'components/canvas/CanvasSVG';

type DrawingCarouselProps = {
  drawings: string[];
};

export function DrawingCarousel({ drawings }: DrawingCarouselProps) {
  const width = useCardWidth(1, { margin: 64, maxWidth: 250, minWidth: 150 });

  return (
    <div style={{ width: '100%', maxWidth: '96vw', margin: '0 auto' }}>
      <Carousel
        autoplay
        autoplaySpeed={4000}
      >
        {drawings.map((d: string) => (
          <CanvasSVG
            key={d}
            drawing={d}
            width={width}
            height={width}
            className="canvas"
          />
        ))}
      </Carousel>
    </div>
  );
}
