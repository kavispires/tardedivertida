import { TextHighlight } from 'components/text';

type UserNameProps = {
  names?: string[];
};
export function UserName({ names }: UserNameProps) {
  if (!names || names.length === 0) {
    return <></>;
  }

  return (
    <>
      : <TextHighlight>{names.at(-1)}</TextHighlight>
    </>
  );
}
