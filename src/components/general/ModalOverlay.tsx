import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';
// Ant Design Resources
import {
  CloseOutlined,
  RotateLeftOutlined,
  RotateRightOutlined,
  SwapOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
} from '@ant-design/icons';
import { Button, Space } from 'antd';
// Sass
import styles from './ModalOverlay.module.scss';

type ModalOverlayProps = {
  children: React.ReactNode;
  onClose: () => void;
  open: boolean;
};

/**
/**
 * Modal overlay component with transformation controls for scaling, rotating, and flipping content
 */
export const ModalOverlay: React.FC<ModalOverlayProps> = ({ children, onClose, open }) => {
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [flipX, setFlipX] = useState(false);
  const [flipY, setFlipY] = useState(false);

  const zoomIn = () => setScale((prevScale) => Math.min(prevScale + 0.1, 2));
  const zoomOut = () => setScale((prevScale) => Math.max(prevScale - 0.1, 0.5));
  const rotateLeft = () => setRotation((prevRotation) => prevRotation - 45);
  const rotateRight = () => setRotation((prevRotation) => prevRotation + 45);
  const toggleFlipX = () => setFlipX((prevFlipX) => !prevFlipX);
  const toggleFlipY = () => setFlipY((prevFlipY) => !prevFlipY);

  if (!open) return null;

  const handleOverlayClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className={styles.simpleModalOverlay}
        onClick={handleOverlayClick}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.1 }}
      >
        <AnimatePresence>
          <motion.div
            className={styles.simpleModalOverlayContent}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.3 }}
            transition={{ duration: 0.05 }}
          >
            <Button
              shape="circle"
              size="large"
              ghost
              variant="outlined"
              className={styles.simpleModalOverlayClose}
              onClick={onClose}
              icon={<CloseOutlined />}
            />
            <div
              className={styles.simpleModalOverlayBody}
              style={{
                transform: `scale(${scale}) rotate(${rotation}deg) scaleX(${flipX ? -1 : 1}) scaleY(${flipY ? -1 : 1})`,
              }}
            >
              {children}
            </div>
            <div className={styles.simpleModalOverlayControlsContainer}>
              <Space.Compact className={styles.simpleModalOverlayControls}>
                <Button
                  onClick={zoomIn}
                  ghost
                  icon={<ZoomInOutlined />}
                />

                <Button
                  onClick={zoomOut}
                  ghost
                  icon={<ZoomOutOutlined />}
                />

                <Button
                  onClick={rotateLeft}
                  ghost
                  icon={<RotateLeftOutlined />}
                />
                <Button
                  onClick={rotateRight}
                  ghost
                  icon={<RotateRightOutlined />}
                />

                <Button
                  onClick={toggleFlipX}
                  ghost
                  icon={<SwapOutlined />}
                />
                <Button
                  onClick={toggleFlipY}
                  ghost
                  icon={<SwapOutlined style={{ rotate: '90deg' }} />}
                />
              </Space.Compact>
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
};
