import { CheckCircleFilled, CloseCircleOutlined } from '@ant-design/icons';

type VerifierProps = {
  label: string;
  value: boolean;
};

export function Verifier({ label, value }: VerifierProps) {
  return (
    <div className="classifier__verifier">
      {label}:{' '}
      {value ? (
        <CheckCircleFilled style={{ color: 'green' }} />
      ) : (
        <CloseCircleOutlined style={{ color: 'red' }} />
      )}
    </div>
  );
}
