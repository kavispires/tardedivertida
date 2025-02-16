import { motion } from 'framer-motion';
// Ant Design Resources
import { Avatar, Flex, Image, Typography } from 'antd';
// Utils
import { getAnimation } from 'utils/animations';
// Components
import { DoorFrame } from 'components/game/DoorFrame';
import { ImageCard } from 'components/image-cards';
import { SpaceContainer } from 'components/layout/SpaceContainer';

type CorridorProps = {
  number: number;
  imagesIds: string[];
  width: number;
  passcode?: string;
};

export function Corridor({ number, imagesIds, width, passcode }: CorridorProps) {
  return (
    <>
      {passcode ? (
        <Flex justify="center" gap={6}>
          <Typography.Text keyboard>{passcode}</Typography.Text>
        </Flex>
      ) : (
        <Flex justify="center" gap={6}>
          <CorridorNumber number={number} corridorNumber={1} />
          <CorridorNumber number={number} corridorNumber={2} />
          <CorridorNumber number={number} corridorNumber={3} />
        </Flex>
      )}
      <Image.PreviewGroup>
        <SpaceContainer className="corridor">
          {imagesIds.map((cardId, index) => (
            <DoorFrame key={cardId} width={width}>
              <motion.div {...getAnimation('zoomIn', { delay: index * 0.1, speed: 'fast' })}>
                <ImageCard id={cardId} cardWidth={150} />
              </motion.div>
            </DoorFrame>
          ))}
        </SpaceContainer>
      </Image.PreviewGroup>
    </>
  );
}

function CorridorNumber({ number, corridorNumber }: { number: number; corridorNumber: number }) {
  return (
    <Avatar
      style={corridorNumber === number ? { backgroundColor: 'gold', color: 'black' } : undefined}
      size="small"
    >
      {corridorNumber}
    </Avatar>
  );
}
