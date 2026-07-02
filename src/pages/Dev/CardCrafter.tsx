import { DndContext, type DragEndEvent, useDraggable } from '@dnd-kit/core';
import clsx from 'clsx';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useCopyToClipboard, useTitle } from 'react-use';
// Ant Design Resources
import { App, Button, Flex, Input, InputNumber, Layout, Select, Space, Switch, Tag, Typography } from 'antd';
// Components
import { TransparentButton } from '@components/buttons/TransparentButton';
import { DynamicCard } from '@components/cards/DynamicCard';
import { PageLayout } from '@components/layout/PageLayout';
// Internal
import {
  type CardConfig,
  type CardElement,
  createDefaultElement,
  generateCode,
  generateRandomColor,
  isElementOffCanvas,
} from './utils/cardCrafterHelpers';
import { DevHeader } from './DevHeader';
// Sass
import styles from './CardCrafter.module.scss';

function CardCrafter() {
  useTitle('Card Crafter | Dev | Tarde Divertida');

  return (
    <PageLayout>
      <DevHeader title="Card Crafter" />
      <Layout.Content className="dev-content">
        <Typography.Paragraph className="contained">
          Visual editor for creating DynamicCard layouts. Add elements, position them with drag-and-drop or
          precise inputs, and generate ready-to-use code. Keyboard shortcuts: Delete (remove), Ctrl+Z (undo),
          Ctrl+Y (redo), Ctrl+D (duplicate).
        </Typography.Paragraph>

        <CardCrafterContent />
      </Layout.Content>
    </PageLayout>
  );
}

/**
 * Draggable element component
 */
type DraggableElementProps = {
  element: CardElement;
  isSelected: boolean;
  onClick: () => void;
};

function DraggableElement({ element, isSelected, onClick }: DraggableElementProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: element.id,
  });

  const style: React.CSSProperties = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
  };

  const isOffCanvas = isElementOffCanvas(element);

  return (
    <DynamicCard.Span
      top={element.top}
      bottom={element.bottom}
      left={element.left}
      right={element.right}
      centerHorizontal={element.centerHorizontal}
      centerVertical={element.centerVertical}
      width={element.width}
      fontSize={element.fontSize}
      aspectRatio={element.aspectRatio}
      borderRadius={element.borderRadius}
      padding={element.padding}
      borderWidth={element.borderWidth}
      className={clsx(
        styles.cardCrafter__element,
        isSelected && styles['cardCrafter__element--selected'],
        isDragging && styles['cardCrafter__element--dragging'],
        isOffCanvas && styles['cardCrafter__element--off-canvas'],
        element.transparent && styles['cardCrafter__element--transparent'],
      )}
      style={{
        ...style,
        backgroundColor: element.transparent ? 'transparent' : element.backgroundColor,
      }}
    >
      <div
        ref={setNodeRef}
        {...listeners}
        {...attributes}
        onClick={onClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            onClick();
          }
        }}
        role="button"
        tabIndex={0}
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {element.name}
      </div>
    </DynamicCard.Span>
  );
}

function CardCrafterContent() {
  const { message } = App.useApp();

  // Card configuration
  const [cardConfig, setCardConfig] = useState<CardConfig>({
    width: 256,
    aspectRatio: 1.5,
    backgroundImageId: 'er-bg-default',
  });

  // Elements state
  const [elements, setElements] = useState<CardElement[]>([]);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);

  // History for undo/redo
  const [history, setHistory] = useState<CardElement[][]>([]);
  const [historyStep, setHistoryStep] = useState(-1);

  // Clipboard
  const [, copyToClipboard] = useCopyToClipboard();

  // Element counter for naming
  const elementCounterRef = useRef(1);

  // Save to history
  const saveToHistory = useCallback(
    (newElements: CardElement[]) => {
      setHistory((prev) => {
        // Discard any "redo" futures if we are making a new change mid-history
        const nextHistory = prev.slice(0, historyStep + 1);
        nextHistory.push([...newElements]);

        // Cap the memory to 10 steps max
        if (nextHistory.length > 10) {
          return nextHistory.slice(-10);
        }
        return nextHistory;
      });

      // Cap the index at 9 (since max length is 10)
      setHistoryStep((prev) => Math.min(prev + 1, 9));
    },
    [historyStep],
  );

  // Update elements with history
  const updateElements = useCallback(
    (newElements: CardElement[]) => {
      setElements(newElements);
      saveToHistory(newElements);
    },
    [saveToHistory],
  );

  // Add new element
  const handleAddElement = useCallback(() => {
    const newElement = createDefaultElement(`element-${elementCounterRef.current}`);
    elementCounterRef.current += 1;
    updateElements([...elements, newElement]);
    setSelectedElementId(newElement.id);
  }, [elements, updateElements]);

  // Delete element
  const handleDeleteElement = useCallback(
    (id: string) => {
      updateElements(elements.filter((el) => el.id !== id));
      if (selectedElementId === id) {
        setSelectedElementId(null);
      }
    },
    [elements, selectedElementId, updateElements],
  );

  // Duplicate element
  const handleDuplicateElement = useCallback(
    (id: string) => {
      const element = elements.find((el) => el.id === id);
      if (!element) return;

      const newElement = createDefaultElement(`${element.name}-copy`);
      // Offset the duplicate slightly
      const topValue = element.top ? Number.parseFloat(element.top) : 50;
      const leftValue = element.left ? Number.parseFloat(element.left) : 50;

      updateElements([
        ...elements,
        {
          ...element,
          id: newElement.id,
          name: newElement.name,
          top: element.top ? `${topValue + 5}%` : undefined,
          left: element.left ? `${leftValue + 5}%` : undefined,
        },
      ]);
      setSelectedElementId(newElement.id);
    },
    [elements, updateElements],
  );

  // Move element in layer order
  const handleMoveElement = useCallback(
    (id: string, direction: 'up' | 'down') => {
      const index = elements.findIndex((el) => el.id === id);
      if (index === -1) return;

      const newElements = [...elements];
      const targetIndex = direction === 'up' ? index + 1 : index - 1;

      if (targetIndex < 0 || targetIndex >= newElements.length) return;

      [newElements[index], newElements[targetIndex]] = [newElements[targetIndex], newElements[index]];
      updateElements(newElements);
    },
    [elements, updateElements],
  );

  // Update element property
  const handleUpdateElement = useCallback(
    (id: string, updates: Partial<CardElement>) => {
      const newElements = elements.map((el) => (el.id === id ? { ...el, ...updates } : el));
      updateElements(newElements);
    },
    [elements, updateElements],
  );

  // Undo/Redo
  const handleUndo = useCallback(() => {
    if (historyStep > 0) {
      setHistoryStep(historyStep - 1);
      setElements(history[historyStep - 1]);
    }
  }, [history, historyStep]);

  const handleRedo = useCallback(() => {
    if (historyStep < history.length - 1) {
      setHistoryStep(historyStep + 1);
      setElements(history[historyStep + 1]);
    }
  }, [history, historyStep]);

  // Copy code to clipboard
  const handleCopyCode = useCallback(() => {
    const code = generateCode(elements);
    copyToClipboard(code);
    message.success('Code copied to clipboard!');
  }, [elements, copyToClipboard, message]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Delete selected element
      if (e.key === 'Delete' && selectedElementId) {
        handleDeleteElement(selectedElementId);
      }

      // Undo (Ctrl+Z / Cmd+Z)
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      }

      // Redo (Ctrl+Y / Cmd+Shift+Z)
      if (
        ((e.ctrlKey || e.metaKey) && e.key === 'y') ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'z')
      ) {
        e.preventDefault();
        handleRedo();
      }

      // Duplicate (Ctrl+D / Cmd+D)
      if ((e.ctrlKey || e.metaKey) && e.key === 'd' && selectedElementId) {
        e.preventDefault();
        handleDuplicateElement(selectedElementId);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedElementId, handleDeleteElement, handleUndo, handleRedo, handleDuplicateElement]);

  // Drag and drop handler
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, delta } = event;
      const elementId = active.id as string;

      const element = elements.find((el) => el.id === elementId);
      if (!element) return;

      // FIX 1: Calculate the realistic card height based on aspect ratio
      const cardHeight = cardConfig.width * cardConfig.aspectRatio;

      // FIX 2: Convert pixel deltas to percentages on the correct axes
      const topDelta = (delta.y / cardHeight) * 100;
      const leftDelta = (delta.x / cardConfig.width) * 100;

      // FIX 3: Get current values, defaulting to 50 if they were previously centered
      const currentTop = element.top ? Number.parseFloat(element.top) : element.centerVertical ? 50 : 0;
      const currentLeft = element.left ? Number.parseFloat(element.left) : element.centerHorizontal ? 50 : 0;

      const newElements = elements.map((el) =>
        el.id === elementId
          ? {
              ...el,
              top: `${(currentTop + topDelta).toFixed(1)}%`,
              left: `${(currentLeft + leftDelta).toFixed(1)}%`,
            }
          : el,
      );

      // FIX 4: Call the unified update method outside of a state setter
      updateElements(newElements);
    },
    [elements, cardConfig.width, cardConfig.aspectRatio, updateElements],
  );
  const selectedElement = selectedElementId ? elements.find((el) => el.id === selectedElementId) : null;

  return (
    <div className={styles.cardCrafterGrid}>
      {/* Preview Column */}
      <div className={clsx(styles.cardCrafter__column, styles['cardCrafter__column--preview'], 'contained')}>
        <h3 className={styles.cardCrafter__sectionTitle}>Preview</h3>
        <DndContext onDragEnd={handleDragEnd}>
          <div className={styles.cardCrafter__previewContainer}>
            <DynamicCard
              width={cardConfig.width}
              backgroundImageId={cardConfig.backgroundImageId}
              aspectRatio={cardConfig.aspectRatio}
            >
              {elements.map((element) => (
                <DraggableElement
                  key={element.id}
                  element={element}
                  isSelected={selectedElementId === element.id}
                  onClick={() => setSelectedElementId(element.id)}
                />
              ))}
            </DynamicCard>
          </div>
        </DndContext>
      </div>

      {/* Controls Column */}
      <div className={clsx(styles.cardCrafter__column, styles['cardCrafter__column--controls'], 'contained')}>
        <h3 className={styles.cardCrafter__sectionTitle}>Controls</h3>

        {/* Card Configuration */}
        <div className={styles.cardCrafter__configSection}>
          <h4>Card Configuration</h4>
          <div className={styles.cardCrafter__formGroup}>
            <div className={styles.cardCrafter__label}>Preview Width (px)</div>
            <InputNumber
              value={cardConfig.width}
              onChange={(value) => setCardConfig({ ...cardConfig, width: value || 256 })}
              min={128}
              max={512}
              step={64}
            />
          </div>
          <div className={styles.cardCrafter__formGroup}>
            <div className={styles.cardCrafter__label}>Aspect Ratio</div>
            <Select
              value={cardConfig.aspectRatio}
              onChange={(value) => setCardConfig({ ...cardConfig, aspectRatio: value })}
              options={[
                { label: 'Square (1:1)', value: 1 },
                { label: 'Portrait (2:3)', value: 1.5 },
                { label: 'Landscape (3:2)', value: 0.67 },
              ]}
            />
          </div>
          <div className={styles.cardCrafter__formGroup}>
            <div className={styles.cardCrafter__label}>Background Image ID</div>
            <Input
              value={cardConfig.backgroundImageId}
              onChange={(e) => setCardConfig({ ...cardConfig, backgroundImageId: e.target.value })}
              placeholder="er-bg-default"
            />
          </div>
        </div>

        {/* Element List */}
        <div className={styles.cardCrafter__configSection}>
          <h4>Elements ({elements.length})</h4>
          <Button
            type="primary"
            onClick={handleAddElement}
            block
          >
            Add Element
          </Button>
          <div className={styles.cardCrafter__elementList}>
            {elements.map((element, index) => (
              <div
                key={element.id}
                className={clsx(
                  styles.cardCrafter__elementItem,
                  selectedElementId === element.id && styles['cardCrafter__elementItem--selected'],
                )}
                onClick={() => setSelectedElementId(element.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setSelectedElementId(element.id);
                  }
                }}
                role="button"
                tabIndex={0}
              >
                <div
                  className={styles.cardCrafter__elementColor}
                  style={{
                    backgroundColor: element.transparent ? 'transparent' : element.backgroundColor,
                    border: element.transparent ? '1px dashed rgba(0,0,0,0.3)' : undefined,
                  }}
                />
                <Flex
                  gap={12}
                  align="center"
                >
                  <Tag className={styles.cardCrafter__elementName}>{element.name}</Tag>
                  <div className={styles.cardCrafter__buttonGroup}>
                    <TransparentButton
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMoveElement(element.id, 'down');
                      }}
                      disabled={index === 0}
                      title="Move down (back)"
                    >
                      ↓
                    </TransparentButton>
                    <TransparentButton
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMoveElement(element.id, 'up');
                      }}
                      disabled={index === elements.length - 1}
                      title="Move up (front)"
                    >
                      ↑
                    </TransparentButton>
                    <TransparentButton
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDuplicateElement(element.id);
                      }}
                      title="Duplicate (Ctrl+D)"
                    >
                      ⎘
                    </TransparentButton>
                    <TransparentButton
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteElement(element.id);
                      }}
                      title="Delete"
                    >
                      ✕
                    </TransparentButton>
                  </div>
                </Flex>
              </div>
            ))}
          </div>
        </div>

        {/* Property Editor */}
        {selectedElement && (
          <div className={styles.cardCrafter__configSection}>
            <h4>Edit: {selectedElement.name}</h4>
            <div className={styles.cardCrafter__formGroup}>
              <div className={styles.cardCrafter__label}>Name</div>
              <Input
                value={selectedElement.name}
                onChange={(e) => handleUpdateElement(selectedElement.id, { name: e.target.value })}
              />
            </div>

            <div className={styles.cardCrafter__propertyGrid}>
              <div className={styles.cardCrafter__formGroup}>
                <div className={styles.cardCrafter__label}>Top</div>
                <UnitInputNumber
                  value={selectedElement.top}
                  onChange={(val) => handleUpdateElement(selectedElement.id, { top: val })}
                  defaultUnit="%"
                />
              </div>
              <div className={styles.cardCrafter__formGroup}>
                <div className={styles.cardCrafter__label}>Bottom</div>
                <UnitInputNumber
                  value={selectedElement.bottom}
                  onChange={(val) => handleUpdateElement(selectedElement.id, { bottom: val })}
                  defaultUnit="%"
                />
              </div>
              <div className={styles.cardCrafter__formGroup}>
                <div className={styles.cardCrafter__label}>Left</div>
                <UnitInputNumber
                  value={selectedElement.left}
                  onChange={(val) => handleUpdateElement(selectedElement.id, { left: val })}
                  defaultUnit="%"
                />
              </div>
              <div className={styles.cardCrafter__formGroup}>
                <div className={styles.cardCrafter__label}>Right</div>
                <UnitInputNumber
                  value={selectedElement.right}
                  onChange={(val) => handleUpdateElement(selectedElement.id, { right: val })}
                  defaultUnit="%"
                />
              </div>
            </div>

            <div className={styles.cardCrafter__formGroup}>
              <div className={styles.cardCrafter__label}>
                <Switch
                  checked={selectedElement.centerHorizontal}
                  onChange={(checked) =>
                    handleUpdateElement(selectedElement.id, { centerHorizontal: checked })
                  }
                  size="small"
                />{' '}
                Center Horizontal
              </div>
            </div>
            <div className={styles.cardCrafter__formGroup}>
              <div className={styles.cardCrafter__label}>
                <Switch
                  checked={selectedElement.centerVertical}
                  onChange={(checked) => handleUpdateElement(selectedElement.id, { centerVertical: checked })}
                  size="small"
                />{' '}
                Center Vertical
              </div>
            </div>

            <div className={styles.cardCrafter__propertyGrid}>
              <div className={styles.cardCrafter__formGroup}>
                <div className={styles.cardCrafter__label}>Width</div>
                <UnitInputNumber
                  value={selectedElement.width}
                  onChange={(val) => handleUpdateElement(selectedElement.id, { width: val })}
                  defaultUnit="cqw"
                />
              </div>
              <div className={styles.cardCrafter__formGroup}>
                <div className={styles.cardCrafter__label}>Font Size</div>
                <UnitInputNumber
                  value={selectedElement.fontSize}
                  onChange={(val) => handleUpdateElement(selectedElement.id, { fontSize: val })}
                  defaultUnit="cqw"
                />
              </div>
              <div className={styles.cardCrafter__formGroup}>
                <div className={styles.cardCrafter__label}>Aspect Ratio</div>
                {/* Aspect Ratio stays as a normal input because it formats as "1 / 1" */}
                <Input
                  value={selectedElement.aspectRatio || ''}
                  onChange={(e) =>
                    handleUpdateElement(selectedElement.id, { aspectRatio: e.target.value || undefined })
                  }
                  placeholder="1 / 1"
                />
              </div>
              <div className={styles.cardCrafter__formGroup}>
                <div className={styles.cardCrafter__label}>Border Radius</div>
                <UnitInputNumber
                  value={selectedElement.borderRadius}
                  onChange={(val) => handleUpdateElement(selectedElement.id, { borderRadius: val })}
                  defaultUnit="cqw" // Changed to cqw
                />
              </div>
              <div className={styles.cardCrafter__formGroup}>
                <div className={styles.cardCrafter__label}>Padding</div>
                <UnitInputNumber
                  value={selectedElement.padding}
                  onChange={(val) => handleUpdateElement(selectedElement.id, { padding: val })}
                  defaultUnit="cqw"
                />
              </div>
              <div className={styles.cardCrafter__formGroup}>
                <div className={styles.cardCrafter__label}>Border Width</div>
                <UnitInputNumber
                  value={selectedElement.borderWidth}
                  onChange={(val) => handleUpdateElement(selectedElement.id, { borderWidth: val })}
                  defaultUnit="cqw" // Changed to cqw
                />
              </div>
            </div>

            <div className={styles.cardCrafter__formGroup}>
              <div className={styles.cardCrafter__label}>
                <Switch
                  checked={selectedElement.transparent}
                  onChange={(checked) => handleUpdateElement(selectedElement.id, { transparent: checked })}
                  size="small"
                />{' '}
                Transparent Background
              </div>
            </div>

            {!selectedElement.transparent && (
              <div className={styles.cardCrafter__formGroup}>
                <div className={styles.cardCrafter__label}>Background Color</div>
                <Space>
                  <Input
                    type="color"
                    value={selectedElement.backgroundColor}
                    onChange={(e) =>
                      handleUpdateElement(selectedElement.id, { backgroundColor: e.target.value })
                    }
                    style={{ width: 60 }}
                  />
                  <Button
                    size="small"
                    onClick={() =>
                      handleUpdateElement(selectedElement.id, { backgroundColor: generateRandomColor() })
                    }
                  >
                    Random
                  </Button>
                </Space>
              </div>
            )}
          </div>
        )}

        {/* History Controls */}
        <div className={styles.cardCrafter__configSection}>
          <h4>History</h4>
          <Space>
            <Button
              onClick={handleUndo}
              disabled={historyStep <= 0}
            >
              Undo (Ctrl+Z)
            </Button>
            <Button
              onClick={handleRedo}
              disabled={historyStep >= history.length - 1}
            >
              Redo (Ctrl+Y)
            </Button>
          </Space>
          <div className={styles.cardCrafter__historyInfo}>
            Step {historyStep + 1} of {history.length}
          </div>
        </div>
      </div>

      {/* Output Column */}
      <div className={clsx(styles.cardCrafter__column, styles['cardCrafter__column--output'], 'contained')}>
        <h3 className={styles.cardCrafter__sectionTitle}>Code Output</h3>
        <Button
          type="primary"
          onClick={handleCopyCode}
          block
        >
          Copy Code to Clipboard
        </Button>
        <Typography.Paragraph
          className={styles.cardCrafter__codeInfo}
          copyable
        >
          <pre className={styles.cardCrafter__codeOutput}>{generateCode(elements)}</pre>
        </Typography.Paragraph>
      </div>
    </div>
  );
}

/**
 * A wrapper for Ant Design's InputNumber that automatically handles CSS units.
 * Splits strings like "15cqw" into a number input (15) and a unit dropdown (cqw).
 */
function UnitInputNumber({
  value,
  onChange,
  defaultUnit = 'cqw',
}: {
  value: string | number | undefined;
  onChange: (val: string | undefined) => void;
  defaultUnit?: string;
}) {
  const strValue = value?.toString() || '';
  const match = strValue.match(/^([\d.-]+)(.*)$/);
  const numValue = match ? Number.parseFloat(match[1]) : null;
  const currentUnit = match && match[2].trim() !== '' ? match[2].trim() : defaultUnit;

  return (
    <Space.Compact>
      <InputNumber
        value={numValue}
        onChange={(newNum) => {
          if (newNum === null) {
            onChange(undefined);
          } else {
            onChange(`${newNum}${currentUnit}`);
          }
        }}
      />
      <Select
        value={currentUnit}
        onChange={(newUnit) => {
          if (numValue !== null) {
            onChange(`${numValue}${newUnit}`);
          }
        }}
        options={[
          { value: 'cqw', label: 'cqw' },
          { value: '%', label: '%' },
          // px completely removed to enforce scalable design
        ]}
        style={{ width: 70 }}
      />
    </Space.Compact>
  );
}

export default CardCrafter;
