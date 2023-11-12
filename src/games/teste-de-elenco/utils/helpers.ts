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

  let prompt = `Escreva o resumo de um filme de ${movie.title.pt} que contenha os personagens e incorpore  as suas características no texto. Dê um nome a cada personagem. Para a idade, escolha um número aleatório dentre a faixa dada, por exemplo 20-30, diga 26 anos. Não use parenteses no texto. Adicione um plot twist inesperado. Aqui vão os personagens: \n`;

  Object.values(movie.roles).forEach((role) => {
    if (role.cast) {
      if (role.id === 'THE_SPECIAL_GUEST') {
        prompt += `\nA revelação`;
      } else {
        prompt += `\n${role.title.pt} `;
      }
      if (role.id === 'THE_NARRATOR') {
        prompt += `(revele que o narrador como um dos personagens relacionados ao protagonista) `;
      }

      prompt += `- ${role.description.pt}:`;
      const actor = role.candidates[role.actor];
      prompt += ` ${actor.gender === 'male' ? 'homem' : 'mulher'}, idade entre ${actor.age}, ${
        actor.ethnicity
      },`;
      prompt += ` com as características: ${role.traits.join(', ')}.\n`;
    }
  });

  return prompt;
};

export const getMovieSummary = (movie: FeatureFilm) => {
  const roles = Object.values(movie.roles).filter((role) => role.cast);
  const totalActors = roles.length;

  // Calculate Gender diversity
  const maleCount = roles.filter((role) => role.candidates[role.actor].gender === 'male').length;
  const femaleCount = totalActors - maleCount;
  const genderDiversity = Math.abs((maleCount - femaleCount) / totalActors) * 100;

  // Calculate Age diversity
  const uniqueAges = new Set(roles.map((role) => role.candidates[role.actor].age));
  const ageDiversity = (uniqueAges.size / totalActors) * 100;

  // Calculate Ethnicity diversity
  const uniqueRaces = new Set(roles.map((role) => role.candidates[role.actor].ethnicity));
  const ethnicityDiversity = (uniqueRaces.size / totalActors) * 100;

  let isLGBTQA = false;
  if (
    movie.rolesOrder.includes('THE_LOVE_INTEREST') &&
    movie.roles.THE_LOVE_INTEREST.actor &&
    movie.rolesOrder.includes('THE_PROTAGONIST') &&
    movie.roles.THE_PROTAGONIST.actor
  ) {
    const loveInterestGender: string =
      movie.roles.THE_LOVE_INTEREST.candidates[movie.roles.THE_LOVE_INTEREST.actor].gender;

    const protagonistGender: string =
      movie.roles.THE_PROTAGONIST.candidates[movie.roles.THE_PROTAGONIST.actor].gender;
    isLGBTQA = loveInterestGender === protagonistGender;
  }

  return {
    genderDiversity,
    ageDiversity,
    ethnicityDiversity,
    isLGBTQA,
  };
};
