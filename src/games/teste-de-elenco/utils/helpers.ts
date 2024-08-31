// Types
import type { FeatureFilm } from './types';
// Icons
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
    let prompt = `Write the script for the trailer of a ${movie.genre.en} movie titled "${movie.movieTitle}" movie that contains the following characters and their traits. Give the characters names and if the story contains a narrator, make him/her also one of the characters related to the protagonist. End the text with an impactful question. Here are the characters:\n`;

    Object.values(movie.roles).forEach((role) => {
      if (role.cast) {
        if (role.id === 'THE_SPECIAL_GUEST') {
          prompt += `\nThe reveal `;
        } else {
          prompt += `\n${role.title.en} `;
        }
        if (role.id === 'THE_NARRATOR') {
          prompt += `(reveal the narrator as one of the characters related to the protagonist) `;
        }

        prompt += `- ${role.description.en}:`;

        const actor = role.candidates[role.actor ?? ''];
        prompt += ` ${actor.name[language].split(' ')[0]}, ${actor.gender}, age ${actor.age}, ${
          actor.ethnicity
        },`;
        prompt += ` with the traits: ${role.traits.join(', ')}.\n`;
      }
    });

    return prompt;
  }

  let prompt = `Escreva o resumo de um filme de ${movie.genre.pt} entitulado "${movie.movieTitle}" que contenha os personagens e incorpore as suas características na trama, seja criativo e também incorpore esses objetos na trama: ${movie.movieProps.map((item) => item.name.pt).join(', ')}. Dê um nome a cada personagem. Para a idade, escolha um número aleatório dentre a faixa dada, por exemplo 20-30, diga 26 anos. Não use parenteses no texto. Adicione um plot twist inesperado. Aqui vão os personagens: \n`;

  Object.values(movie.roles).forEach((role) => {
    if (role.cast) {
      if (role.id === 'THE_SPECIAL_GUEST') {
        prompt += `\nA revelação `;
      } else {
        prompt += `\n${role.title.pt} `;
      }
      if (role.id === 'THE_NARRATOR') {
        prompt += `(revele que o narrador como um dos personagens relacionados ao protagonista) `;
      }

      prompt += `- ${role.description.pt}:`;
      const actor = role.candidates[role.actor ?? ''];
      prompt += ` ${actor.name[language].split(' ')[0]},  ${
        actor.gender === 'male' ? 'homem' : 'mulher'
      }, idade entre ${actor.age}, ${actor.ethnicity},`;
      prompt += ` com as características: ${role.traits.join(', ')}.\n`;
    }
  });

  return prompt;
};

export const getMovieSummary = (movie: FeatureFilm) => {
  const roles = Object.values(movie.roles).filter((role) => role.cast);
  const totalActors = roles.length;

  // Calculate Gender diversity
  const maleCount = roles.filter((role) => role.candidates[role.actor!].gender === 'male').length;
  const femaleCount = roles.filter((role) => role.candidates[role.actor!].gender === 'female').length;

  const genderDiversity = Math.round(
    (Math.min(femaleCount, maleCount) / Math.max(femaleCount, maleCount)) * 100
  );

  // Calculate Age diversity
  const uniqueAges = new Set(roles.map((role) => role.candidates[role.actor!].age));
  const ageDiversity = (() => {
    if (uniqueAges.size <= 1) return 0;

    return Math.round(((uniqueAges.size - 1) / (totalActors - 1)) * 100);
  })();

  // Calculate Ethnicity diversity
  const uniqueRaces = new Set(roles.map((role) => role.candidates[role.actor!].ethnicity));
  const ethnicityDiversity = (() => {
    if (uniqueRaces.size <= 1) return 0;

    return Math.round(((uniqueRaces.size - 1) / (totalActors - 1)) * 100);
  })();

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
