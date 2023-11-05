// Ant Design Resources
import { Space } from 'antd';
// Hooks

// Utils

// Components
import { Step } from 'components/steps';
import { Instruction, TextHighlight, Title } from 'components/text';
import { DualTranslate, Translate } from 'components/language';
import { RoleBoard } from './components/RoleBoard';
import { TimedButton } from 'components/buttons';
import { SuspectCard } from 'components/cards/SuspectCard';
import { ImageCard } from 'components/image-cards';
import { ActorsSelections } from './components/ActorsSelections';

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
  return (
    <Step fullWidth announcement={announcement}>
      <Title size="x-small">
        <Translate pt="Resultado" en="Results" />
      </Title>

      <RoleBoard activeRole={activeRole} instruction="RESULT" outcome={outcome}>
        {outcome === 'CAST' ? (
          <SuspectCard suspect={activeRole.candidates[activeRole.actor]} width={120} />
        ) : (
          <ImageCard imageId="us-unknown" cardWidth={120} preview={false} />
        )}
      </RoleBoard>

      <Instruction contained>
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
      </Instruction>

      <ActorsSelections actors={activeRole.candidates} selection={activeRole.selection} players={players} />

      <Space className="space-container" align="center">
        <TimedButton duration={15} onExpire={goToNextStep} onClick={goToNextStep}>
          <Translate pt="Ver Ranking" en="See Ranking" />
        </TimedButton>
      </Space>
    </Step>
  );
}
