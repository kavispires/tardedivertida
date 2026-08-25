import type { ReactNode } from 'react';

type SpinningVinylRecordIconProps = {
  cover?: ReactNode;
};

export function SpinningVinylRecordIcon({ cover }: SpinningVinylRecordIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlSpace="preserve"
      width="512"
      height="512"
      fillRule="evenodd"
      strokeLinejoin="round"
      strokeMiterlimit="2"
      clipRule="evenodd"
      viewBox="0 0 512 512"
    >
      <style>
        {`
          /* The subtle wobble for the light reflections */
          @keyframes shimmerWobble {
            0% { transform: rotate(0deg);  }
            25% { transform: rotate(0.8deg);  }
            50% { transform: rotate(-0.4deg);  }
            75% { transform: rotate(0.5deg);  }
            100% { transform: rotate(0deg);  }
          }

          /* The continuous 360 rotation for the physical record parts */
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }

          .vinyl-highlights {
            transform-origin: 256px 256px;
            animation: shimmerWobble 0.3s infinite linear;
          }

          .vinyl-spin {
            transform-origin: 256px 256px;
            /* 3s is a nice visual speed, but change it to 1.8s for a mathematically accurate 33 1/3 RPM */
            animation: spin 4s infinite linear;
          }
        `}
      </style>

      {/* Highlights (Jittering) */}
      <g className="vinyl-highlights">
        <path
          fill="#39654b"
          fillRule="nonzero"
          d="M26.37 160.884C14.22 190.184 7.5 222.305 7.5 256s6.72 65.816 18.87 95.116l158.051 45V115.884z"
        ></path>
        <path
          fill="#44484e"
          fillRule="nonzero"
          d="M485.63 160.884h-54.271v190.232h54.271c12.15-29.3 18.87-61.421 18.87-95.116s-6.72-65.816-18.87-95.116"
        ></path>
        <path
          fill="#39654b"
          fillRule="nonzero"
          d="m461.359 170.937-133.78-45v260.125l133.78-45c8.5-26.536 13.141-55.183 13.141-85.063s-4.641-58.525-13.141-85.062"
        ></path>
        <path
          fill="#4e2c52"
          fillRule="nonzero"
          d="m256 7.5 205.359 163.437 24.271-10.053C448.29 70.841 359.548 7.5 256 7.5m205.359 333.563L256 504.5c103.548 0 192.29-63.341 229.63-153.384z"
        ></path>
        <path
          fill="#44484e"
          fillRule="nonzero"
          d="M256 7.5C152.452 7.5 63.71 70.841 26.37 160.884l188.051 77.893C221.182 222.472 237.249 211 256 211s34.818 11.472 41.579 27.777l163.78-67.84C430.817 75.588 350.401 7.5 256 7.5m205.359 333.563-163.78-67.84C290.818 289.528 274.751 301 256 301s-34.818-11.472-41.579-27.777L26.37 351.116C63.71 441.159 152.452 504.5 256 504.5c94.401 0 174.817-68.088 205.359-163.437"
        ></path>
        <path
          fill="#2f8147"
          fillRule="nonzero"
          d="M402.464 195.333h-74.885l-30 43.445A44.8 44.8 0 0 1 301 256c0 6.102-1.22 11.917-3.421 17.223l30 43.445h74.885c7.75-18.688 12.036-39.176 12.036-60.667 0-21.492-4.286-41.98-12.036-60.668M211 256c0-6.102 1.22-11.917 3.421-17.223l-30-43.445h-74.885C101.786 214.021 97.5 234.509 97.5 256s4.286 41.979 12.036 60.667h74.885l30-43.445A44.8 44.8 0 0 1 211 256"
        ></path>
        <path
          fill="#39654b"
          fillRule="nonzero"
          d="M256 301c-18.751 0-34.818-11.472-41.579-27.777l-104.885 43.445C133.352 374.1 189.954 414.5 256 414.5s122.648-40.4 146.464-97.833l-104.885-43.445C290.818 289.528 274.751 301 256 301m0-90c18.751 0 34.818 11.472 41.579 27.777l104.885-43.445C378.648 137.9 322.046 97.5 256 97.5s-122.648 40.4-146.464 97.833l104.885 43.445C221.182 222.472 237.249 211 256 211"
        ></path>
      </g>

      {/* Red Center Circle Base */}
      <path
        fill="#cf2731"
        d="M256 372c-64.065 0-116-51.935-116-116s51.935-116 116-116 116 51.935 116 116-51.935 116-116 116"
      ></path>

      <g className="vinyl-spin">
        <foreignObject
          x="140"
          y="140"
          width="232"
          height="232"
        >
          <div
            // xmlns="http://www.w3.org/1999/xhtml"
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {cover}
            {/* <GameBanner
            gameName={'arte-ruim'}
            width={232 * 1.5}
          /> */}
          </div>
        </foreignObject>
      </g>

      {/* Solid Black Grooves (Stationary) */}
      <path
        fillRule="nonzero"
        d="M437.02 74.98C388.668 26.629 324.38 0 256 0S123.332 26.629 74.98 74.98C26.629 123.333 0 187.62 0 256s26.629 132.667 74.98 181.02C123.332 485.371 187.62 512 256 512s132.668-26.629 181.02-74.98C485.371 388.667 512 324.38 512 256s-26.629-132.667-74.98-181.02M256 497C123.112 497 15 388.888 15 256S123.112 15 256 15s241 108.112 241 241-108.112 241-241 241"
      ></path>
      <path
        fillRule="nonzero"
        d="M256 452c108.075 0 196-87.925 196-196S364.075 60 256 60 60 147.925 60 256s87.925 196 196 196m0-377c99.804 0 181 81.196 181 181s-81.196 181-181 181S75 355.804 75 256 156.196 75 256 75"
      ></path>
      <path
        fillRule="nonzero"
        d="M256 422c91.532 0 166-74.467 166-166S347.532 90 256 90 90 164.467 90 256s74.468 166 166 166m0-317c83.262 0 151 67.738 151 151s-67.738 151-151 151-151-67.738-151-151 67.738-151 151-151"
      ></path>
      <path
        fillRule="nonzero"
        d="M256 379.5c68.099 0 123.5-55.402 123.5-123.5S324.099 132.5 256 132.5 132.5 187.902 132.5 256 187.901 379.5 256 379.5m0-232c59.827 0 108.5 48.673 108.5 108.5S315.827 364.5 256 364.5 147.5 315.827 147.5 256 196.173 147.5 256 147.5"
      ></path>

      {/* The specific groove with the gap (Spinning) */}
      <path
        className="vinyl-spin"
        fillRule="nonzero"
        d="M415.806 96.194C373.12 53.508 316.366 30 256 30c-54.612 0-107.335 19.748-148.457 55.605a7.5 7.5 0 0 0 9.857 11.306C155.791 63.436 205.013 45 256 45c116.346 0 211 94.654 211 211s-94.654 211-211 211S45 372.346 45 256c0-50.986 18.436-100.209 51.91-138.6a7.5 7.5 0 0 0-.724-10.582 7.5 7.5 0 0 0-10.582.724C49.748 148.665 30 201.389 30 256c0 60.367 23.508 117.12 66.194 159.806S195.634 482 256 482s117.12-23.508 159.806-66.194S482 316.367 482 256s-23.508-117.12-66.194-159.806"
      ></path>
    </svg>
  );
}
