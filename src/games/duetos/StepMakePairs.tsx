// Hooks
import { useLoading } from 'hooks/useLoading';
// Components
import { Step } from 'components/steps';
import { Instruction, Title } from 'components/text';
import { Translate } from 'components/language';
import { Space } from 'antd';
import { ItemCard } from 'components/cards/ItemCard';
import { ImageCard } from 'components/image-cards';
import { Card } from 'components/cards';
import { SuspectCard } from 'components/cards/SuspectCard';
import { CharacterCard } from 'components/cards/CharacterCard';

type StepTemplateProps = {
  players: GamePlayers;
  user: GamePlayer;
  pool: any[];
} & AnnouncementProps;

export function StepMakePairs({ players, user, announcement, pool }: StepTemplateProps) {
  const { isLoading } = useLoading();

  return (
    <Step fullWidth announcement={announcement}>
      <Title>
        <Translate pt={<>?</>} en={<>?</>} />
      </Title>

      {isLoading}
      <Instruction contained>
        <Translate pt={<>?</>} en={<>?</>} />
      </Instruction>

      <Space wrap className="items-grid">
        {pool.map((entry, index) => {
          if (entry.type === 'alien-item') {
            return <ItemCard key={entry.value.id} id={entry.value.id} width={75} />;
          }
          if (entry.type === 'images') {
            return <ImageCard key={entry.value} imageId={entry.value} cardWidth={100} />;
          }
          if (entry.type === 'words') {
            return (
              <Card key={entry.value.id} hideHeader>
                {entry.value.text}
              </Card>
            );
          }
          if (entry.type === 'suspects') {
            return (
              <div key={entry.value.id}>
                <SuspectCard suspect={entry.value} width={100} />
              </div>
            );
          }
          if (entry.type === 'contenders') {
            return <CharacterCard key={entry.value.id} character={entry.value} size={120} />;
          }

          return <div key={index}>{entry.type}</div>;
        })}
      </Space>
    </Step>
  );
}
