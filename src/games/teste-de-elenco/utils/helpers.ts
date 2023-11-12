import { MovieComedyIcon } from 'icons/MovieComedyIcon';
import { MovieActionIcon } from 'icons/MovieActionIcon';
import { MovieDramaIcon } from 'icons/MovieDramaIcon';
import { MovieHorrorIcon } from 'icons/MovieHorrorIcon';
import { MovieSciFiIcon } from 'icons/MovieSciFiIcon';

export const Icons: Record<string, any> = {
  ACTION: MovieActionIcon,
  COMEDY: MovieComedyIcon,
  DRAMA: MovieDramaIcon,
  HORROR: MovieHorrorIcon,
  SCI_FI: MovieSciFiIcon,
};

export const chatGPTMoviePrompt = (movie: FeatureFilm, language: Language): string => {
  if (language === 'en') {
    let prompt = `Write the plot of a ${movie.title.en} movie that contains the following characters and their traits. Give the characters names and if the story contains a narrator, make him/her also one of the characters related to the protagonist. End the text with an impactful question. Here are the characters:\n`;

    Object.values(movie.roles).forEach((role) => {
      if (role.cast) {
        prompt += `\n${role.title.pt} - ${role.description.pt}:`;
        const actor = role.candidates[role.actor];
        prompt += ` ${actor.gender}, age ${actor.age}, ${actor.ethnicity},`;
        prompt += ` with the traits: ${role.traits.join(', ')}.\n`;
      }
    });

    return prompt;
  }

  let prompt = `Escreva o enredo de um filme de ${movie.title.pt} que contenha os personagens a seguir e suas características. Dê nome os personagens e se a história contém um narrador, faça com que ele seja também um dos personagens relacionado com o protagonista. Termine o texto com uma pergunta impactante. Aqui vão os personagens:\n`;

  Object.values(movie.roles).forEach((role) => {
    if (role.cast) {
      prompt += `\n${role.title.pt} - ${role.description.pt}:`;
      const actor = role.candidates[role.actor];
      prompt += ` ${actor.gender === 'male' ? 'homem' : 'mulher'}, idade entre ${actor.age}, ${
        actor.ethnicity
      },`;
      prompt += ` com as características: ${role.traits.join(', ')}.\n`;
    }
  });

  return prompt;
};
