import { useMemo } from 'react';
// Ant Design Resources
import { Space } from 'antd';
// Types
import type { ActingRole } from './utils/types';
// Components
import { Step } from 'components/steps';
import { RuleInstruction, TextHighlight, Title } from 'components/text';
import { DualTranslate, Translate } from 'components/language';
import { RoleBoard } from './components/RoleBoard';
import { TimedButton } from 'components/buttons';
import { SuspectCard } from 'components/cards/SuspectCard';
import { ImageCard } from 'components/image-cards';
import { ActorsSelections } from './components/ActorsSelections';
import { ReleasedActors } from './components/ReleasedActors';
import { Container } from 'components/general/Container';

type StepResultProps = {
  user: GamePlayer;
  activeRole: ActingRole;
  outcome: string;
  players: GamePlayers;
  goToNextStep: GenericFunction;
} & AnnouncementProps;

export function StepResult({
  user,
  announcement,
  activeRole,
  goToNextStep,
  outcome,
  players,
}: StepResultProps) {
  const playersSelections = useMemo(() => {
    return Object.values(players).reduce((acc: Record<CardId, PlayerId[]>, player) => {
      if (acc[player.actorId] === undefined) {
        acc[player.actorId] = [];
      }
      acc[player.actorId].push(player.id);
      return acc;
    }, {});
  }, [players]);

  return (
    <Step fullWidth announcement={announcement}>
      <Title size="x-small">
        <Translate pt="Resultado" en="Results" />
      </Title>

      <RoleBoard activeRole={activeRole} instruction="RESULT" outcome={outcome}>
        {outcome === 'CAST' ? (
          <SuspectCard suspect={activeRole.candidates[activeRole.actor!]} width={120} />
        ) : (
          <ImageCard id="us-unknown" cardWidth={120} preview={false} />
        )}
      </RoleBoard>

      <RuleInstruction type="event">
        {outcome === 'CONTINUE' && (
          <Translate
            pt="Os diretores não chegaram num consenso. Aqui estão os atores selecionados para a próxima fase:"
            en="The directors did not reach a consensus. Here are the selected actors for the next phase:"
          />
        )}
        {outcome === 'CAST' && (
          <Translate
            pt={
              <>
                <TextHighlight>
                  <DualTranslate>{activeRole.candidates[activeRole.actor!].name}</DualTranslate>
                </TextHighlight>{' '}
                foi escolhido(a) para o papel!
              </>
            }
            en={
              <>
                <TextHighlight>
                  <DualTranslate>{activeRole.candidates[activeRole.actor!].name}</DualTranslate>
                </TextHighlight>{' '}
                was chosen for the role!
              </>
            }
          />
        )}
        {outcome === 'FAIL' && (
          <Translate
            pt="Deu ruim! Ninguém foi escolhido para o papel! E vão remover o personagem do roteiro"
            en="Oh no! Nobody was chosen for the role! And they will remove the character from the script"
          />
        )}
      </RuleInstruction>

      <ActorsSelections
        actors={activeRole.candidates}
        selection={activeRole.selection}
        players={players}
        playersSelections={playersSelections}
      />

      <Space className="space-container" align="center">
        <TimedButton duration={25} onExpire={goToNextStep} onClick={goToNextStep}>
          <Translate pt="Ver Ranking" en="See Ranking" />
        </TimedButton>
      </Space>

      <Container
        title={
          <Translate
            pt="Atores não foram selecionados para a próxima fase"
            en="Actors who didn't move to the next phase"
          />
        }
      >
        <ReleasedActors
          actors={activeRole.candidates ?? {}}
          selection={activeRole.selection ?? []}
          players={players}
          playersSelections={playersSelections}
        />
      </Container>
    </Step>
  );
}
