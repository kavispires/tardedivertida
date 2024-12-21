// Internal
import { getRandomItem, stringRemoveAccents } from './helpers';

/**
 * Tells browser to speak out loud given sentence in given language in given volume
 * @param text
 * @param language
 * @param volume
 */
export function speak(
  text: DualLanguageValue,
  language: Language,
  volume: number,
  onEnd: GenericFunction = () => {},
): void {
  const utterance = new SpeechSynthesisUtterance(text[language]);
  utterance.lang = language === 'pt' ? 'pt-BR' : 'en-US';
  utterance.volume = volume;
  utterance.addEventListener('end', onEnd);
  window.speechSynthesis.speak(utterance);
}

/**
 * Give variety to the lobby greeting message
 * @param name
 * @returns
 */
export function getRandomWelcomeMessage(name: string): DualLanguageValue {
  // Special flavia
  if (stringRemoveAccents(name.toLowerCase()).startsWith('fla')) {
    const options = [
      {
        pt: `A mais sexy de todas chegou! Bem-vinda, ${name}!`,
        en: `Welcome, ${name}!`,
      },
      {
        pt: `Fiu, fiu! ${name} chegou para abalar e sensualizar!`,
        en: `Welcome, ${name}!`,
      },
      {
        pt: `Olha só quem chegou! ${name}, a mais linda de todas!`,
        en: `Welcome, ${name}!`,
      },
    ];

    return getRandomItem(options);
  }

  const options = [
    {
      pt: `Bem-vindo, ${name}!`,
      en: `Welcome, ${name}!`,
    },
    {
      pt: 'Olha ele, ou ela, ou elix, aqui!',
      en: 'Look at you! Ready to play!',
    },
    {
      pt: 'Eba! Você entrou',
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
      pt: 'O jogo vai ser muito mais sensual agora que você entrou',
      en: `The game will be so much better now that you're here!`,
    },
    {
      pt: `Olha quem decidiu dar as caras! Bem-vindo, ${name}!`,
      en: `Look who decided to show up! Welcome, ${name}!`,
    },
    {
      pt: `A festa começou! ${name} chegou!`,
      en: `The party has started! ${name} is here!`,
    },
    {
      pt: `Seja bem-vindo ao rolê, ${name}!`,
      en: `Welcome to the fun, ${name}!`,
    },
    {
      pt: `Você trouxe a energia boa, ${name}! Vamos lá!`,
      en: `You brought the good vibes, ${name}! Let’s go!`,
    },
    {
      pt: `Ah, que delícia! ${name} chegou para animar a galera!`,
      en: `Oh, how wonderful! ${name} is here to spice things up!`,
    },
    {
      pt: `Atenção, pessoal! O rei ou rainha ${name} chegou!`,
      en: `Attention, everyone! King or Queen ${name} has arrived!`,
    },
    {
      pt: `Ei, ${name}! Você trouxe o lanche? Porque a diversão já começou!`,
      en: `Hey, ${name}! Did you bring snacks? Because the fun has already started!`,
    },
    {
      pt: `Preparem-se! ${name} é a estrela do show!`,
      en: `Get ready! ${name} is the star of the show!`,
    },
    {
      pt: `Olha o povo! ${name} entrou e agora é só alegria!`,
      en: `Look out, world! ${name} is here and it’s all fun from now on!`,
    },
    {
      pt: `Parou tudo! ${name} chegou e agora o jogo vai bombar!`,
      en: `Hold everything! ${name} has arrived, and now the game is about to blow up!`,
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
      pt: 'Pronto! Agora é so esperar esses manés',
      en: 'Done and Ready to play! Were you born ready?',
    },
    {
      pt: 'Pronto! Cá entre nós, estou torcendo por você!',
      en: 'Done! And can I tell you a secret? I’m rooting for you!',
    },
    {
      pt: `Pronto! Que comece a diversão! Não se esqueça de respirar, ${name}!`,
      en: `Ready! Let the fun begin! Don't forget to breathe, ${name}!`,
    },
    {
      pt: 'Pronto! Agora é só esperar esses lagartixas chegarem!',
      en: 'Ready! Now just waiting for those slowpokes to show up!',
    },
    {
      pt: 'Pronto! Se você estiver tão empolgado quanto eu, vamos arrebentar!',
      en: `Ready! If you're as excited as I am, we’re going to crush it!`,
    },
    {
      pt: 'Pronto! Espero que você tenha trazido suas habilidades secretas!',
      en: 'Ready! I hope you brought your secret skills with you!',
    },
    {
      pt: 'Pronto! Estou mais ansioso que criança na véspera de Natal!',
      en: 'Ready! I’m more excited than a kid on Christmas Eve!',
    },
    {
      pt: `Pronto! Hora de mostrar quem manda! Boa sorte, ${name}!`,
      en: `Ready! Time to show who’s boss! Good luck, ${name}!`,
    },
    {
      pt: 'Pronto! Prepare-se para a aventura mais épica da sua vida!',
      en: 'Ready! Get ready for the most epic adventure of your life!',
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
      pt: 'Tudo bem. Não se preocupe em vencer, já que as chances são bem baixas.',
      en: "It’s alright. Don't worry too much about winning, there’s very little chance anyway.",
    },
    {
      pt: 'Ok, ok, ok. Respire fundo, e vamos lá!',
      en: 'Okay, okay okay. Take deep breaths and let’s go!',
    },
    {
      pt: `Relaxa, ${name}! O importante é se divertir... e perder!`,
      en: `Relax, ${name}! The important thing is to have fun... and lose!`,
    },
    {
      pt: 'Não se preocupe, a confusão faz parte do jogo!',
      en: 'Don’t worry, confusion is part of the game!',
    },
    {
      pt: 'Ok, sem regras, só instinto! Vamos ver no que dá!',
      en: 'Okay, no rules, just instincts! Let’s see how this goes!',
    },
    {
      pt: 'Quem precisa de regras? O jogo vai ficar mais interessante assim!',
      en: 'Who needs rules? The game will be way more interesting this way!',
    },
    {
      pt: 'Não tenha medo! O pior que pode acontecer é... bem, vamos descobrir!',
      en: 'Don’t be scared! The worst that can happen is... well, let’s find out!',
    },
    {
      pt: 'Vai ser divertido! E se não for, pelo menos temos histórias!',
      en: 'It’ll be fun! And if not, at least we’ll have stories to tell!',
    },
    {
      pt: `A única regra é... não há regras! Vamos nessa, ${name}!`,
      en: `The only rule is... there are no rules! Let’s do this, ${name}!`,
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
      pt: 'Que carai, eim. As regras foram explicadas super bem. Agora vai assim mesmo!',
      en: 'W.T.F, the rules were so clear! Well, the game is starting anyway',
    },
    {
      pt: 'Segura o tchan, amarra o tchan, segura o tchan-tchan-tchan-tchan-tchan. Estou cantando pra esquecer que você vai me decepcionar',
      en: 'Oh my... let’s hope for the best!',
    },
    {
      pt: `Olha só, ${name}. Se não entendeu as regras, é melhor segurar o choro!`,
      en: `Look, ${name}. If you didn't get the rules, you better hold back those tears!`,
    },
    {
      pt: `Uau, ${name}, você é um verdadeiro prodígio da confusão! Vamos lá!`,
      en: `Wow, ${name}, you’re a true prodigy of confusion! Let’s do this!`,
    },
    {
      pt: `Ah, não se preocupe, ${name}. A derrota vai ser tão engraçada quanto a sua falta de atenção!`,
      en: `Oh, don’t worry, ${name}. Your loss is going to be as funny as your lack of focus!`,
    },
    {
      pt: `Vish, ${name}, quem precisa de regras quando se tem uma boa dose de caos?`,
      en: `Yikes, ${name}, who needs rules when you can have a good dose of chaos?`,
    },
    {
      pt: 'Se você não entendeu nada, é melhor pedir ajuda a alguém... ou não!',
      en: 'If you didn’t get anything, you might want to ask for help... or not!',
    },
    {
      pt: 'Espero que você seja bom em improvisar, porque as regras não ajudaram!',
      en: 'I hope you’re good at improvising because the rules didn’t help!',
    },
    {
      pt: `Que lindo, ${name}. Você entrou na aventura sem saber o que está fazendo!`,
      en: `How lovely, ${name}. You jumped into the adventure without knowing what you’re doing!`,
    },
  ];

  return getRandomItem(options);
}
