// Types
import type { DatingCandidateCardData, DatingCandidateImageCardData } from 'types/tdr';
// Components
import { ImageCard } from '@components/image-cards/ImageCard';
import { DualTranslate } from '@components/language/DualTranslate';
import { Translate } from '@components/language/Translate';

type CandidateProps = {
  head: DatingCandidateImageCardData;
  body: DatingCandidateImageCardData;
  interest: DatingCandidateCardData;
  need: DatingCandidateCardData;
  funFact: DatingCandidateCardData;
};

export const Candidate = ({ head, body, interest, need, funFact }: CandidateProps) => {
  return (
    <div className="noa-candidate">
      <div className="noa-candidate__image">
        <div className="noa-candidate__text">
          <DualTranslate>{head.name}</DualTranslate>
        </div>
        <ImageCard
          classic
          cardWidth={100}
          cardId={head.id}
          preview={false}
        />
        <ImageCard
          classic
          cardWidth={100}
          cardId={body.id}
          preview={false}
        />
        <div className="noa-candidate__text">
          <DualTranslate>{body.name}</DualTranslate>
        </div>
      </div>
      <div className="noa-candidate__info">
        <div className="noa-candidate__info-entry">
          <div className="noa-candidate__info-label">
            <Translate
              pt="Curto/Quero"
              en="I enjoy/wish to"
            />
          </div>
          {interest.text}
        </div>
        <div className="noa-candidate__info-entry">
          <div className="noa-candidate__info-label">
            <Translate
              pt="Quero alguém que"
              en="I want someone who"
            />
          </div>
          {need.text}
        </div>
        <div className="noa-candidate__info-entry">
          <div className="noa-candidate__info-label">
            <Translate
              pt="Uma coisa sobre mim"
              en="Something about me"
            />
          </div>
          {funFact.text}
        </div>
      </div>
    </div>
  );
};
