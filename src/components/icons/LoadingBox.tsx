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
    <path fill="none" stroke="currentColor" strokeWidth="4" d="M25 25H75V75H25z">
      <animateTransform
        id="strokeBox"
        attributeName="transform"
        attributeType="XML"
        begin="rectBox.end"
        dur="0.5s"
        from="0 50 50"
        to="180 50 50"
        type="rotate"
      ></animateTransform>
    </path>
    <path fill="currentColor" d="M27 27H73V77H27z">
      <animate
        id="rectBox"
        fill="red"
        attributeName="height"
        attributeType="XML"
        begin="0s;strokeBox.end"
        dur="1.3s"
        from="50"
        to="0"
      ></animate>
    </path>
  </svg>
);

export function LoadingBox(props: any): JSX.Element {
  return <Icon component={Svg} {...props} />;
}
