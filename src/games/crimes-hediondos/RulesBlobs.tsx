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
            ajudar os outros jogadores a descobrirem qual arma e qual objeto foram usados em seu último crime.
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
