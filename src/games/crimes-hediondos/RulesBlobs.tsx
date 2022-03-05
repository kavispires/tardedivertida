// Components
import { Instruction, Translate } from 'components';

export function WelcomeMessage(): JSX.Element {
  return (
    <Instruction contained>
      <Translate
        pt={
          <>
            Bem-vindo à Convenção Anual de Serial Killers!
            <br />
            Você e os outros serial killers decidiram fazer um jogo de adivinhação.
            <br />
            O objetivo é todos darem dicas sobre as circunstâncias que seus últimos crimes aconteceram para
            ajudar os outros jogadores a descobrirem qual arma e qual objeto foram usados durante o crime.
            <br />
            Prontos para aterrorizar?
          </>
        }
        en={
          <>
            Welcome to the Annual Serial Killers Con!
            <br />
            You and the other serial killers decided to make it a game out of it.
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

export function GuessMessage(): JSX.Element {
  return (
    <Instruction contained>
      <Translate
        pt={
          <>
            Baseado nas informações dadas pelos jogadores, tente adivinhar qual arma e objeto cada jogador
            usou em seu crime.
            <br />
            Você ganha pontos se adivinhar uma das cartas ou ambas as cartas, e você também ganha pontos se os
            outros adivinharem as suas cartas.
          </>
        }
        en={
          <>
            Based on the information given by other players, try to guess the weapon and object used on their
            crimes.
            <br />
            You get points for getting one or both cards correctly, and you get points when other players get
            yours correctly.
          </>
        }
      />
    </Instruction>
  );
}

export function ScoringMessage(): JSX.Element {
  return (
    <Instruction contained>
      <Translate
        pt={
          <>
            Você ganha 1 ponto para cada arma ou objeto que você acertar.
            <br />
            Você ganha 3 pontos bônus se acertar as duas cartas de um mesmo jogador.
            <br />
            Para todos os seus acertos, seus respectivos autores ganham 1 ponto (ou 3 se você acertou ambos).
            <br />
            Mas tem um segredinho... você só vê os seus pontos.
          </>
        }
        en={
          <>
            You get 1 point for each weapon or evidence you get correctly.
            <br />
            You gain 3 extra points if you got both cards correctly for the same player.
            <br />
            All of your correct guesses grant 1 extra point to the authors (or 3 if you got both).
            <br />
            But there's a secret... you only see your scoring, not others'.
          </>
        }
      />
    </Instruction>
  );
}

export function GenericMessage(): JSX.Element {
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
