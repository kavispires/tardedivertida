import { Carousel } from 'antd';
import { CanvasSVG } from 'components/canvas';
import { useCardWidth } from 'hooks/useCardWidth';

type DrawingCarouselProps = {
  drawings: string[];
};

export function DrawingCarousel({ drawings }: DrawingCarouselProps) {
  const width = useCardWidth(1, { margin: 64, maxWidth: 250, minWidth: 150, containerId: 'root' });

  return (
    <Carousel autoplay className="carousel" autoplaySpeed={4000}>
      {drawings.map((d: string) => (
        <CanvasSVG key={d} drawing={d} width={width} height={width} className="canvas" />
      ))}
    </Carousel>
  );
}
