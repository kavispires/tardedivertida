import React from 'react';
import { Instruction } from '../../shared';

export function WritingRules() {
  return (
    <Instruction contained>
      Hora de escrever uma dica para a palavra escolhida!
      <br />
      A dica tem que ser uma palavra única que ajude o adivinhador... adivinhar.
      <br />
      É proibido usar derivados, partes da palavra ou traduções em outras línguas.
      <br />E não seja tão óbvio, já que dicas similares são eliminadas!
    </Instruction>
  );
}

export function ComparisonRules() {
  return (
    <Instruction>
      Hora de comparar as dicas e eliminar as similares!
      <br />O aplicativo elimina automaticamente todas as paralavas idênticas, mas os jogadores precisam
      eliminar as inválidas e similares.
    </Instruction>
  );
}

export function GuessingRules({ guesserName }) {
  return (
    <Instruction>
      Hora de {guesserName} brilhar!
      <br />
      Você tem uma única change de adivinhar a palavra secreta!
      <br />
      Pense em voz alta! (É mais divertido para os outros jogadores)
    </Instruction>
  );
}
