// Types
import type { GameRound } from 'types/game';
// Components
import { TimedButton } from '@components/buttons/TimedButton';
import { Translate } from '@components/language/Translate';
import { PointsHighlight } from '@components/metrics/PointsHighlight';
import { Step } from '@components/steps/Step';
import { RuleInstruction } from '@components/text/RuleInstruction';
import { StepTitle } from '@components/text/StepTitle';
// Internal
import type { ClientCard, Teller } from './utils/types';
import { useNextStepDuration, useOrderedTellers } from './utils/hooks';
import { TellerBoardResolution } from './components/TellerBoardResolution';

type StepResolutionProps = {
  deckDict: Dictionary<ClientCard>;
  tellers: Dictionary<Teller>;
  goToNextStep: () => void;
  cardWidth: number;
  round: GameRound;
};

export function StepResolution({ tellers, deckDict, goToNextStep, cardWidth, round }: StepResolutionProps) {
  const tellersList = useOrderedTellers(tellers);
  const duration = useNextStepDuration(tellersList);

  return (
    <Step fullWidth>
      <StepTitle size="medium">
        <Translate
          pt="Só atenderemos os primeiros clientes..."
          en="Only the first customers will be served..."
        />
      </StepTitle>

      {tellersList.map((teller) => (
        <TellerBoardResolution
          key={`${teller.id}`}
          teller={teller}
          deckDict={deckDict}
          cardWidth={cardWidth}
          animate
        />
      ))}

      <TimedButton
        type="primary"
        duration={round.current === 1 ? 25 : duration}
        disabled
        onExpire={() => goToNextStep()}
      >
        <Translate
          pt="Continuando em..."
          en="Continuing in..."
        />
      </TimedButton>

      <RuleInstruction type="scoring">
        <Translate
          pt={
            <>
              Cada jogador ganha <PointsHighlight value="pontos" /> por cada cliente da sua própria cor que
              conseguiu atendimento e dependendo de quantos pontos a posição dá.
              <br />
              Cada caixa tem dois tipos de clientes que gosta mais e dobra os pontos deles
              <br />
              Se você ativou um "Dá pra fazer isso online", você ganha <PointsHighlight value={1} /> (ou{' '}
              <PointsHighlight value={2} /> para crianças).
              <br />
              Crianças nunca podem ser atendidas.
            </>
          }
          en={
            <>
              Each player scores <PointsHighlight value="points" /> for each customer of their own color that
              got served, depending on how many points the position gives.
              <br />
              Each teller has two types of customers they like more and they double the points of those
              customers.
              <br />
              If you activated a "You can do this online", you score <PointsHighlight value={1} /> (or{' '}
              <PointsHighlight value={2} /> for kids).
              <br />
              Children can never be served.
            </>
          }
        />
      </RuleInstruction>
    </Step>
  );
}
