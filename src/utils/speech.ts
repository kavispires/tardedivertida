import { getRandomItem } from './helpers';

/**
 * Tells browser to speak out loud given sentence in given language in given volume
 * @param text
 * @param language
 * @param volume
 */
export function speak(text: DualLanguageValue, language: Language, volume: number): void {
  const utterance = new SpeechSynthesisUtterance(text[language]);
  utterance.lang = language === 'pt' ? 'pt-BR' : 'en-US';
  utterance.volume = volume;
  window.speechSynthesis.speak(utterance);
}

/**
 * Give variety to the lobby greeting message
 * @param name
 * @returns
 */
export function getRandomWelcomeMessage(name: string): DualLanguageValue {
  const options = [
    {
      pt: `Bem-vindo, ${name}!`,
      en: `Welcome, ${name}!`,
    },
    {
      pt: `Olha ele, ou ela, ou elix, aqui!`,
      en: `Look at you! Ready to play!`,
    },
    {
      pt: `Eba! Você entrou`,
      en: `Yay, you're in!`,
    },
    {
      pt: `Saudações, ${name}!`,
      en: `Greetings, ${name}!`,
    },
    {
      pt: `${name} chegou para abalar essa geringonça!`,
      en: `${name} is here!`,
    },
    {
      pt: `Presente, presidente. ${name} está aqui, fessô!`,
      en: `You are here, ${name}!`,
    },
    {
      pt: `O jogo vai ser muito mais sensual agora que você entrou`,
      en: `The game will be so much better now that you're here!`,
    },
  ];

  return getRandomItem(options);
}

export function getRandomPositiveReadyMessage(name: string): DualLanguageValue {
  const options = [
    {
      pt: `Pronto! Aguarde os outros jogadores estarem prontos. Boa sorte, ${name}`,
      en: `Done! Now wait for the other players. Good luck, ${name}`,
    },
    {
      pt: `Pronto! Agora é so esperar esses manés`,
      en: `Done and Ready to play! Were you born ready?`,
    },
    {
      pt: `Pronto! Cá entre nós, estou torcendo por você!`,
      en: `Done! And can I tell you a secret? I'm rooting for you!`,
    },
  ];

  return getRandomItem(options);
}

export function getRandomNeutralReadyMessage(name: string): DualLanguageValue {
  const options = [
    {
      pt: `Agora só resta rezar, ${name}, porque o jogo vai começar mesmo assim!`,
      en: `Now all you have left is to pray ${name} because the game is starting anyway!`,
    },
    {
      pt: `Tudo bem. Não se preocupe em vencer, já que as chances são bem baixas.`,
      en: `It's alright. Don't worry too much about winning, there's very little chance anyway.`,
    },
    {
      pt: `Ok, ok, ok. Respire fundo, e vamos lá!`,
      en: `Okay, okay okay. Take deep breaths and let's go!`,
    },
  ];

  return getRandomItem(options);
}

export function getRandomNegativeReadyMessage(name: string): DualLanguageValue {
  const options = [
    {
      pt: `Vixi ${name}, se fudeu então, porque o jogo vai começar mesmo assim!`,
      en: `Oh ${name}, you are screwed because the game is starting anyway!`,
    },
    {
      pt: `Que carai, eim. As regras foram explicadas super bem. Agora vai assim mesmo!`,
      en: `W.T.F, the rules were so clear! Well, the game is starting anyway`,
    },
    {
      pt: `Segura o tchan, amarra o tchan, segura o tchan-tchan-tchan-tchan-tchan. Estou cantando pra esquecer que você vai me decepcionar`,
      en: `Oh my... let's hope for the best!`,
    },
  ];

  return getRandomItem(options);
}
