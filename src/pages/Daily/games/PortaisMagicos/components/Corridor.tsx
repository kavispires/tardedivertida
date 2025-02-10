import { motion } from 'framer-motion';
// Ant Design Resources
import { Avatar, Flex, Image } from 'antd';
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
};

export function Corridor({ number, imagesIds, width }: CorridorProps) {
  return (
    <>
      <Flex justify="center">
        <Avatar>{number}</Avatar>
      </Flex>
      <Image.PreviewGroup>
        <SpaceContainer>
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
