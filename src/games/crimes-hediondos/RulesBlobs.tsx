// Components
import { Instruction, Translate } from '../../components';

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
            Você ganha 1 ponto para cada arma e objeto que você acertar.
            <br />
            Você ganha 1 ponto bônus se acertar as duas cartas de um mesmo jogador.
            <br />
            Você ganha 1 ponto para cada carta que outros jogadores acertaram sua.
          </>
        }
        en={
          <>
            You get 1 point for each weapon or evidence you get correctly.
            <br />
            You gain 1 extra point if you got both cards correctly for the same player.
            <br />
            You get 1 point for each of the player who got one for your cards correctly.
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
