import { useMemo } from 'react';
// Ant Design Resources
import { TrophyOutlined } from '@ant-design/icons';
// Types
import type { GamePlayers } from 'types/player';
// Hooks
import type { UseStep } from 'hooks/useStep';
// Components
import { TimedButton } from 'components/buttons';
import { SuspectCard } from 'components/cards/SuspectCard';
import { ImageCard } from 'components/image-cards';
import { DualTranslate, Translate } from 'components/language';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { TitledContainer } from 'components/layout/TitledContainer';
import { Step, type StepProps } from 'components/steps';
import { RuleInstruction, TextHighlight, StepTitle } from 'components/text';
// Internal
import type { ActingRole } from './utils/types';
import { RoleBoard } from './components/RoleBoard';
import { ActorsSelections } from './components/ActorsSelections';
import { ReleasedActors } from './components/ReleasedActors';

type StepResultProps = {
  activeRole: ActingRole;
  outcome: string;
  players: GamePlayers;
  goToNextStep: UseStep['goToNextStep'];
} & Pick<StepProps, 'announcement'>;

export function StepResult({ announcement, activeRole, goToNextStep, outcome, players }: StepResultProps) {
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
      <StepTitle>
        <Translate pt="Resultado" en="Results" />
      </StepTitle>

      <RoleBoard activeRole={activeRole} instruction="RESULT" outcome={outcome}>
        {outcome === 'CAST' && activeRole.actor ? (
          <SuspectCard suspect={activeRole.candidates[activeRole.actor]} width={120} />
        ) : (
          <ImageCard cardId="us-unknown" cardWidth={120} preview={false} />
        )}
      </RoleBoard>

      <RuleInstruction type="event">
        {outcome === 'CONTINUE' && (
          <Translate
            pt="Os diretores não chegaram num consenso. Aqui estão os atores selecionados para a próxima fase:"
            en="The directors did not reach a consensus. Here are the selected actors for the next phase:"
          />
        )}
        {outcome === 'CAST' && activeRole.actor && (
          <Translate
            pt={
              <>
                <TextHighlight>
                  <DualTranslate>{activeRole.candidates[activeRole.actor].name}</DualTranslate>
                </TextHighlight>{' '}
                foi escolhido(a) para o papel!
              </>
            }
            en={
              <>
                <TextHighlight>
                  <DualTranslate>{activeRole.candidates[activeRole.actor].name}</DualTranslate>
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

      <SpaceContainer align="center">
        <TimedButton duration={25} onExpire={goToNextStep} onClick={goToNextStep} icon={<TrophyOutlined />}>
          <Translate pt="Ver Ranking" en="See Ranking" />
        </TimedButton>
      </SpaceContainer>

      <TitledContainer
        title={
          outcome === 'CONTINUE' ? (
            <Translate
              pt="Atores que não receberam a maioria de votos e estão fora da próxima próxima fase:"
              en="Actors that did not receive the majority of votes and are out for the next phase:"
            />
          ) : (
            <Translate pt="Atores não escolhidos:" en="Actors that were not chosen:" />
          )
        }
      >
        <ReleasedActors
          actors={activeRole.candidates ?? {}}
          selection={activeRole.selection ?? []}
          players={players}
          playersSelections={playersSelections}
        />
      </TitledContainer>
    </Step>
  );
}
