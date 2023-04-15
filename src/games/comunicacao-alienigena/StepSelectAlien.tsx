// Ant Design Resources
import { Space } from 'antd';
// Hooks
import { useLoading } from 'hooks/useLoading';
import { useVIP } from 'hooks/useVIP';
// Components
import { Step } from 'components/steps';
import { Instruction, Title } from 'components/text';
import { Translate } from 'components/language';
import { TransparentButton } from 'components/buttons';
import { AvatarCard } from 'components/avatars';
import { CurseItemHighlight, ItemsHighlight } from './components/Highlights';
import { TimeHighlight } from 'components/metrics/TimeHighlight';

type StepSelectAlienProps = {
  players: GamePlayers;
  onSubmitAlien: GenericFunction;
  status: OfferingsStatus;
} & AnnouncementProps;

export function StepSelectAlien({ players, announcement, onSubmitAlien, status }: StepSelectAlienProps) {
  const { isLoading } = useLoading();
  const isVIP = useVIP();

  return (
    <Step fullWidth announcement={announcement}>
      <Title>
        <Translate pt="Quem quer ser o alienígena?" en="Who will be the Alien?" />
      </Title>

      <Instruction contained>
        <Translate
          pt={
            <>
              Um alienígena chegou à Terra e não fala nossa língua. Porém, descobrimos que ele quer abduzir{' '}
              <ItemsHighlight>{status.needed}</ItemsHighlight> objetos, mas não sabemos quais.
              <br />
              A cada rodada, devemos mostrar alguns objetos ao alienígena com o objetivo de desvendar um dos
              25 caracteres alienígenas relacionados àqueles objetos. Por exemplo, mostrar uma "bola" e um
              "pneu" talvez descobriremos o símbolo para "redondo".
              <br />
              Então o alienígena vai pedir um objeto específico usando símbolos de sua língua alienígena.
              <br />
              Teremos <TimeHighlight>{status.timeLeft}</TimeHighlight> chances de entregar todos os objetos ao
              alienígena, mas dentre os 25 objetos, há{' '}
              <CurseItemHighlight>{status.totalCurses}</CurseItemHighlight> que o alienígena considera
              amaldiçoado e não quer. Se você oferece um deles, uma chance adicional é usada naquela rodada.
              <br />
              <strong>Um jogador deve ser o alienígena. O administrator selecionará o alienígena.</strong>
            </>
          }
          en={
            <>
              An alien has arrived on Earth and does not speak our language. However, we figured out that they
              want to abduct
              <ItemsHighlight>{status.needed}</ItemsHighlight> objects but we don't know which ones.
              <br />
              Each round, we will show a few objects to the alien in the intent to figure out one of the 25
              alien characters related to those objects. For example, if we should a "ball" and "tire" we
              might figure out what symbol means "round".
              <br />
              Then, the alien will request an specific object using their language.
              <br />
              We have <TimeHighlight>{status.timeLeft}</TimeHighlight> chances to offer all request objects,
              but among the 25 objects there are <CurseItemHighlight>{status.totalCurses}</CurseItemHighlight>{' '}
              ones that the alien considered cursed. If we offer one of them, we waste one additional chance.
              <br />
              <strong>One player must be the alien, the administrator will select it.</strong>
            </>
          }
        />
      </Instruction>

      <Instruction contained>
        <Space className="space-container">
          {Object.values(players).map((player) => {
            if (isVIP) {
              return (
                <TransparentButton
                  key={`p-bt-${player.id}`}
                  disabled={isLoading}
                  onClick={() => onSubmitAlien({ alienId: player.id })}
                >
                  <AvatarCard key={`p-a-${player.id}`} player={player} withName addressUser />
                </TransparentButton>
              );
            }

            return <AvatarCard key={`p-a-${player.id}`} player={player} withName addressUser />;
          })}
        </Space>
      </Instruction>
    </Step>
  );
}
