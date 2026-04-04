import { sample } from 'lodash';
import { useState, useEffect, useCallback } from 'react';
// Ant Design Resources
import { Button, Card, Collapse, Divider, Flex, Space, Typography } from 'antd';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Components
import { ImageCard } from 'components/image-cards/ImageCard';
// Internal
import { type FoiUmPirralhoEntry, generatePuzzle } from './foi-um-pirralho-helpers';
// Sass
import 'assets/fonts/bangers.scss';

const { Title, Paragraph, Text } = Typography;

export default function KindergartenMystery() {
  const { language } = useLanguage();
  const [puzzle, setPuzzle] = useState<FoiUmPirralhoEntry | null>(null);

  // Function to generate a new puzzle
  const generateNewPuzzle = useCallback(() => {
    // Parameters: numKids, numCulprits, exactLiars
    const kids = sample([3, 4, 5, 5, 6, 6, 7]);
    const liars = kids > 5 ? sample([1, 2, 3]) : sample([1, 1, 1, 1, 2]);
    const newGame = generatePuzzle(kids, 1, liars);
    setPuzzle(newGame);
  }, []);

  // Generate a new puzzle when the component mounts
  useEffect(() => {
    generateNewPuzzle();
  }, [generateNewPuzzle]);

  if (!puzzle) return <div>Loading Case...</div>;

  return (
    <Space
      orientation="vertical"
      size="large"
      style={{ width: '100%', maxWidth: 1200, margin: '0 auto', padding: 24 }}
    >
      <Flex
        justify="space-between"
        align="center"
        wrap="wrap"
        gap={16}
      >
        <Title level={2}>Who Stole the Toy? / Quem Roubou o Brinquedo?</Title>
        <Space>
          <Button
            type="primary"
            onClick={generateNewPuzzle}
          >
            {language === 'en' ? 'New Puzzle' : 'Novo Quebra-Cabeça'}
          </Button>
        </Space>
      </Flex>

      <Card>
        <Space
          orientation="horizontal"
          size="small"
          wrap
        >
          <Text strong>{language === 'en' ? 'Number of Kids' : 'Número de Crianças'}:</Text>
          <Text type="secondary">{puzzle.kids.length}</Text>
          <Divider orientation="vertical" />
          <Text strong>{language === 'en' ? 'Number of Liars' : 'Número de Mentirosos'}:</Text>
          <Text type="secondary">{puzzle.liars.length}</Text>
          <Divider orientation="vertical" />
          <Text strong>{language === 'en' ? 'Number of Culprits' : 'Número de Culpados'}:</Text>
          <Text type="secondary">{puzzle.culprits.length}</Text>
          <Divider orientation="vertical" />
          <Text strong>{language === 'en' ? 'Hash ID' : 'ID do Quebra-Cabeça'}:</Text>
          <Text type="secondary">{puzzle.id}</Text>
        </Space>
      </Card>

      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 800,
          height: 800,
          margin: '0 auto',
          border: '1px dashed #d9d9d9',
          borderRadius: 8,
        }}
      >
        {puzzle.kids.map((kid, index) => {
          const angle = (index * 360) / puzzle.kids.length;
          const radius = [20, 24, 28, 32, 35][puzzle.kids.length - 3]; // percentage from center
          const centerX = 50;
          const centerY = 50;
          const x = centerX + radius * Math.cos((angle - 90) * (Math.PI / 180));
          const y = centerY + radius * Math.sin((angle - 90) * (Math.PI / 180));

          return (
            <Card
              key={kid.id}
              size="small"
              style={{
                position: 'absolute',
                left: `${x}%`,
                top: `${y}%`,
                transform: 'translate(-50%, -50%)',
                width: 220,
                textAlign: 'center',
                borderColor: kid.color,
                borderWidth: 3,
                padding: 0,
              }}
              styles={{
                body: { padding: 0 },
              }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: '100px 100px', gap: 8 }}>
                <div style={{ position: 'relative' }}>
                  <ImageCard
                    cardId={kid.cardId}
                    cardWidth={100}
                    preview={false}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 6,
                      left: 0,
                      right: 0,
                      height: '25%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '4px',
                    }}
                  >
                    <Text
                      strong
                      style={{ color: 'black', fontSize: '0.85em' }}
                    >
                      {kid.name[language]} {kid.gender === 'Boy' ? '♂️' : '♀️'}
                    </Text>
                  </div>
                </div>
                <Flex
                  orientation="vertical"
                  style={{ height: '100%' }}
                >
                  <Text type="secondary">{kid.height}cm</Text>
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                    <Paragraph
                      italic
                      style={{
                        width: '100%',
                        fontSize: '1.2em',
                        margin: 0,
                        fontFamily: '"Bangers", system-ui',
                      }}
                    >
                      {kid.statement[language]}
                    </Paragraph>
                  </div>
                </Flex>
              </div>
            </Card>
          );
        })}
      </div>

      <Collapse
        items={[
          {
            key: '1',
            label: language === 'en' ? 'Reveal Solution' : 'Revelar Solução',
            children: (
              <Space
                orientation="vertical"
                size="small"
              >
                <Paragraph>
                  <Text strong>{language === 'en' ? 'Culprits' : 'Culpados'}:</Text>{' '}
                  {puzzle.culprits.map((culprit) => culprit.name[language]).join(', ')}
                </Paragraph>
                <Paragraph>
                  <Text strong>{language === 'en' ? 'Liars' : 'Mentirosos'}:</Text>{' '}
                  {puzzle.liars.map((liar) => liar.name[language]).join(', ')}
                </Paragraph>
              </Space>
            ),
          },
        ]}
      />
    </Space>
  );
}
