// Types
import type { DatingCandidateCard, DatingCandidateImageCard } from 'types/tdr';
// Components
import { ImageCard } from 'components/image-cards';
import { DualTranslate, Translate } from 'components/language';

type CandidateProps = {
  head: DatingCandidateImageCard;
  body: DatingCandidateImageCard;
  interest: DatingCandidateCard;
  need: DatingCandidateCard;
  funFact: DatingCandidateCard;
};

export const Candidate = ({ head, body, interest, need, funFact }: CandidateProps) => {
  return (
    <div className="noa-candidate">
      <div className="noa-candidate__image">
        <div className="noa-candidate__text">
          <DualTranslate>{head.name}</DualTranslate>
        </div>
        <ImageCard classic cardWidth={100} id={head.id} preview={false} />
        <ImageCard classic cardWidth={100} id={body.id} preview={false} />
        <div className="noa-candidate__text">
          <DualTranslate>{body.name}</DualTranslate>
        </div>
      </div>
      <div className="noa-candidate__info">
        <div className="noa-candidate__info-entry">
          <div className="noa-candidate__info-label">
            <Translate pt="Curto/Quero" en="I enjoy/wish to" />
          </div>
          {interest.text}
        </div>
        <div className="noa-candidate__info-entry">
          <div className="noa-candidate__info-label">
            <Translate pt="Quero alguém que" en="I want someone who" />
          </div>
          {need.text}
        </div>
        <div className="noa-candidate__info-entry">
          <div className="noa-candidate__info-label">
            <Translate pt="Uma coisa sobre mim" en="Something about me" />
          </div>
          {funFact.text}
        </div>
      </div>
    </div>
  );
};
