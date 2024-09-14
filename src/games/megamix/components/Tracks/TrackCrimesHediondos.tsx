// Ant Design Resources
import { Button } from 'antd';
// Types
import type { CrimesHediondosCard } from 'types/tdr';
// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
import { useLoading } from 'hooks/useLoading';
import { useMock } from 'hooks/useMock';
// Icons
import { KnifeIcon } from 'icons/KnifeIcon';
import { LoupeIcon } from 'icons/LoupeIcon';
// Components
import { CrimeItemCard } from 'components/cards/CrimeItemCard';
import { SceneTile } from 'components/game/SceneTile';
import { Translate } from 'components/language';
import { MetricHighlight } from 'components/metrics/MetricHighlight';
import { Instruction } from 'components/text';
// Internal
import type { TrackProps } from '../../utils/types';
import { mockSelection } from '../../utils/mock';
import { MinigameTitle } from '../MinigameTitle';
// AntDesign Resources

export const TrackCrimesHediondos = ({ track, onSubmitAnswer, user }: TrackProps) => {
  const cardWidth = useCardWidth(12, { minWidth: 100, maxWidth: 130 });

  const { isLoading } = useLoading();

  // DEV Mock
  useMock(() => {
    onSubmitAnswer({
      data: { value: mockSelection(track.data.cards, 'id') },
    });
  });

  const icon = track.variant === 'weapon' ? <KnifeIcon /> : <LoupeIcon />;

  return (
    <>
      <MinigameTitle title={{ pt: 'Crimes Hediondos', en: 'Horrific Crimes' }} />
      <Instruction contained>
        <Translate
          pt={
            <>
              O médico legista examinou o crime e chegou às conclusões abaixo.
              <br />
              Selecione qual{' '}
              <MetricHighlight icon={icon} iconPlacement="before">
                {track.variant === 'weapon' ? 'arma' : 'evidencia'}
              </MetricHighlight>{' '}
              você acha que foi usada no crime.
            </>
          }
          en={
            <>
              The forensic scientist examined the body and came to those conclusions below.
              <br />
              Select the one{' '}
              <MetricHighlight icon={icon} iconPlacement="before">
                {track.variant}
              </MetricHighlight>{' '}
              you think took part in the crime.
            </>
          }
        />
      </Instruction>

      <ul className="h-table">
        {Boolean(track.data.scenes.causeOfDeath) && (
          <SceneTile tile={track.data.scenes.causeOfDeath} index={track.data.crimeIndexes.causeOfDeath} />
        )}
        {Boolean(track.data.scenes.reasonForEvidence) && (
          <SceneTile
            tile={track.data.scenes.reasonForEvidence}
            index={track.data.crimeIndexes.reasonForEvidence}
          />
        )}

        <SceneTile tile={track.data.scenes.location} index={track.data.crimeIndexes.location} />
        <SceneTile tile={track.data.scenes.sceneA} index={track.data.crimeIndexes.sceneA} />
        <SceneTile tile={track.data.scenes.sceneB} index={track.data.crimeIndexes.sceneB} />
        <SceneTile tile={track.data.scenes.sceneC} index={track.data.crimeIndexes.sceneC} />
      </ul>

      <ul className="h-cards">
        {track.data.cards.map((card: CrimesHediondosCard) => {
          return (
            <li key={card.id} className="margin">
              <CrimeItemCard item={card} cardWidth={cardWidth} isSelected={user?.data?.value === card.id} />

              <Button
                shape="round"
                type="primary"
                disabled={user.ready}
                loading={isLoading}
                onClick={() =>
                  onSubmitAnswer({
                    data: { value: card.id },
                  })
                }
              >
                <Translate pt="Selecionar" en="Select" />
              </Button>
            </li>
          );
        })}
      </ul>
    </>
  );
};
