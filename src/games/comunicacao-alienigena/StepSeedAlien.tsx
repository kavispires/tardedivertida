// Ant Design Resources
// Components
import { Step } from 'components/steps';
import { Instruction, Title } from 'components/text';
import { Translate } from 'components/language';
import { BotPopupRule } from './components/BotPopupRules';
import { HumanSeedingSteps } from './components/HumanSeedingSteps';

type StepSeedAlienProps = {
  players: GamePlayers;
  onSubmitSeeds: GenericFunction;
  user: GamePlayer;
  items: Item[];
} & AnnouncementProps;

export function StepSeedAlien({ user, announcement, players, onSubmitSeeds, items }: StepSeedAlienProps) {
  return (
    <Step fullWidth announcement={announcement}>
      <Title>
        <Translate pt="Análise de Objetos" en="Objects analyses" />
      </Title>

      <BotPopupRule />

      <Instruction contained>
        <Translate
          pt={
            <>
              Você passou sua vida analisando as propriedades de diversos objetos.
              <br />
              Agora, para cada uma dos atributos dados, escolha todos os objetos que você acha que combinam.
            </>
          }
          en={
            <>
              You have spent your life analyzing the properties of various items.
              <br />
              Now, for each of the attributes given to you, choose all the objects that you think match.
            </>
          }
        />
      </Instruction>

      <HumanSeedingSteps onSubmitSeeds={onSubmitSeeds} user={user} items={items} />
    </Step>
  );
}
