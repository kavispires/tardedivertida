export function YesIcon(props: React.SVGProps<SVGSVGElement>): JSX.Element {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" {...props}>
      <path fill="none" d="M.09.09h512v512H.09z"></path>
      <circle cx="256.09" cy="256.09" r="248.59" fill="#46e846"></circle>
      <path
        fill="#32d632"
        d="M398.28 52.16a248 248 0 0189.35 190.93c0 137.29-111.29 248.59-248.59 248.59a247.45 247.45 0 01-142.18-44.69 247.53 247.53 0 00159.23 57.69c137.29 0 248.59-111.29 248.59-248.59a248.28 248.28 0 00-106.4-203.93"
      ></path>
      <path
        fill="none"
        stroke="#000"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="15"
        d="M330.25 493.43a248.51 248.51 0 01-74.16 11.25C118.8 504.68 7.5 393.38 7.5 256.09S118.8 7.5 256.09 7.5s248.59 111.3 248.59 248.59a248.61 248.61 0 01-141.81 224.55"
      ></path>
      <path
        fill="#80ff80"
        d="M305.09 71.64s130.18 30.21 130.18 184.45c0 0-37.91-139.06-130.18-184.45z"
      ></path>
    </svg>
  );
}
