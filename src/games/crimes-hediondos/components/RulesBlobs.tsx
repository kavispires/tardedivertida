// Types
import type { GameRound } from 'types/game';
// Components
import { Translate } from 'components/language';
import { PointsHighlight } from 'components/metrics/PointsHighlight';
import { Instruction } from 'components/text';

export function WelcomeMessage() {
  return (
    <Instruction contained>
      <Translate
        pt={
          <>
            Bem-vindo à Convenção Anual de Serial Killers!
            <br />
            Você e os outros serial killers decidiram fazer uma dinâmica de adivinhação.
            <br />O objetivo é todos darem dicas sobre as circunstâncias que seus últimos crimes aconteceram
            para ajudar os outros jogadores a descobrirem qual arma e qual objeto foram usados durante o
            crime.
            <br />
            Prontos para aterrorizar?
          </>
        }
        en={
          <>
            Welcome to the Annual Serial Killers Con!
            <br />
            You and the other serial killers decided to break the ice and make a game out of it.
            <br />
            The goal is to give clues about the circunstancies your latest crime occurred so the other players
            can guess what weapon and evidence were used during the crime.
            <br />
            Ready to terrorize?
          </>
        }
      />
    </Instruction>
  );
}

export function GuessMessage() {
  return (
    <Instruction contained>
      <Translate
        pt={
          <>
            Baseado nas informações dadas pelos jogadores, tente adivinhar qual arma e objeto cada jogador
            usou em seu crime.
            <br />
            Você ganha pontos se adivinhar uma das cartas ou ambas as cartas, e você também ganha{' '}
            <PointsHighlight>1 ponto</PointsHighlight> para cada uma de suas cartas que os outros adivinharem,
            mas essa pontuação é secreta.
          </>
        }
        en={
          <>
            Based on the information given by other players, try to guess the weapon and object used on their
            crimes.
            <br />
            You get points for getting one or both cards correctly, and you get{' '}
            <PointsHighlight>1 point</PointsHighlight> when other players get each of your cards correctly,
            but these points are kept secret.
          </>
        }
      />
    </Instruction>
  );
}

export function ScoringMessage({ round }: { round: GameRound }) {
  const points = round.total - round.current + 1;
  return (
    <Instruction contained>
      <Translate
        pt={
          <>
            Você ganha <PointsHighlight>1 ponto</PointsHighlight> para cada arma ou objeto que você acertar.
            <br />
            Se você acertar o par de um jogador, você ganha <PointsHighlight>{points} pontos</PointsHighlight>
            .
            <br />
            Para todos os seus acertos, seus respectivos autores ganham{' '}
            <PointsHighlight>1 ponto</PointsHighlight>.
            <br />
            Ganha o jogo o primeiro jogador que acertar tudo.
          </>
        }
        en={
          <>
            You get <PointsHighlight>1 point</PointsHighlight> for each weapon or evidence you get correctly.
            <br />
            If you get the pair for a player, you get <PointsHighlight>{points} points</PointsHighlight>{' '}
            instead.
            <br />
            All of your correct guesses grant <PointsHighlight>1 extra point</PointsHighlight> to the authors.
            <br />
            Wins the game the player who get all correctly first.
          </>
        }
      />
    </Instruction>
  );
}

export function GenericMessage() {
  return (
    <Instruction contained>
      <Translate
        pt={
          <>
            Escrever msg aqui.
            <br />
            Prontos para aterrorizar?
          </>
        }
        en={
          <>
            Message comes here.
            <br />
            Ready to terrorize?
          </>
        }
      />
    </Instruction>
  );
}
