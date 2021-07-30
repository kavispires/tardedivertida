import Icon from '@ant-design/icons';

const Svg = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    x="0"
    y="0"
    version="1.1"
    viewBox="0 0 100 100"
    xmlSpace="preserve"
    width="1em"
    height="1em"
  >
    <circle
      cx="50"
      cy="50"
      r="45"
      fill="none"
      stroke="currentColor"
      strokeMiterlimit="10"
      strokeWidth="10"
    ></circle>
    <path
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeMiterlimit="10"
      strokeWidth="10"
      d="M50 50L80 50.5"
    >
      <animateTransform
        attributeName="transform"
        dur="2s"
        from="0 50 50"
        repeatCount="indefinite"
        to="360 50 50"
        type="rotate"
      ></animateTransform>
    </path>
    <path
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeMiterlimit="10"
      strokeWidth="7"
      d="M50 50L49.5 74"
    >
      <animateTransform
        attributeName="transform"
        dur="15s"
        from="0 50 50"
        repeatCount="indefinite"
        to="360 50 50"
        type="rotate"
      ></animateTransform>
    </path>
  </svg>
);

export function LoadingClock(props) {
  return <Icon component={Svg} {...props} />;
}
