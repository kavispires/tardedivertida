export function BadgeIcon(props: React.SVGProps<SVGSVGElement>): JSX.Element {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" {...props}>
      <path
        fill="#f58a97"
        d="M342.92 462.25l-83.78 41.53c-1.96.97-4.26.97-6.22 0l-83.78-41.53a7 7 0 01-3.89-6.27V249.16h181.56v206.82a7 7 0 01-3.89 6.27z"
      ></path>
      <path
        fill="#f07281"
        d="M316.81 249.16V414.3c0 19-10.77 36.36-27.79 44.8l-59.88 29.68c-1.96.97-4.26.97-6.22 0l30 15c1.96.97 4.26.97 6.22 0l83.78-41.53a7 7 0 003.89-6.27V249.16h-30z"
      ></path>
      <circle cx="256.02" cy="170" r="162.5" fill="#fee97d"></circle>
      <path
        fill="#f4da6e"
        d="M256.02 7.5c-5.06 0-10.06.24-15 .7 82.71 7.57 147.5 77.12 147.5 161.81s-64.79 154.24-147.5 161.81c4.94.45 9.94.7 15 .7 89.75 0 162.5-72.76 162.5-162.5S345.77 7.5 256.02 7.5z"
      ></path>
      <circle cx="256.02" cy="170" r="132.5" fill="#fff"></circle>
      <path
        fill="#f58a97"
        d="M262.3 117.95l13.14 26.62a6.988 6.988 0 005.27 3.83l29.38 4.27c5.74.83 8.03 7.89 3.88 11.94l-21.26 20.72a7.006 7.006 0 00-2.01 6.2l5.02 29.26c.98 5.72-5.02 10.08-10.16 7.38l-26.28-13.82a7.023 7.023 0 00-6.52 0l-26.28 13.82c-5.14 2.7-11.14-1.66-10.16-7.38l5.02-29.26c.39-2.27-.36-4.59-2.01-6.2l-21.26-20.72c-4.16-4.05-1.86-11.11 3.88-11.94l29.38-4.27a6.988 6.988 0 005.27-3.83l13.14-26.62c2.57-5.2 9.99-5.2 12.55 0z"
      ></path>
      <path
        fill="#f07281"
        d="M313.97 164.61c4.16-4.05 1.86-11.11-3.88-11.94l-29.38-4.27a6.988 6.988 0 01-5.27-3.83l-13.14-26.62c-2.57-5.2-9.99-5.2-12.55 0l-11.62 23.55 3.9 7.89c2.71 5.5 7.96 9.31 14.03 10.19 15.28 2.22 21.39 21 10.33 31.78a18.627 18.627 0 00-5.36 16.49l1.4 8.14 23.14 12.17c5.14 2.7 11.14-1.66 10.16-7.38l-5.02-29.26c-.39-2.27.36-4.59 2.01-6.2l21.26-20.72z"
      ></path>
      <path d="M352.84 68.96c-2.99-2.87-7.74-2.77-10.6.23-2.87 2.99-2.77 7.74.23 10.6 24.87 23.84 38.56 55.88 38.56 90.21 0 68.93-56.08 125-125 125s-125-56.08-125-125 56.08-125 125-125c20.89 0 41.57 5.28 59.82 15.27 3.63 1.99 8.19.66 10.18-2.98 1.99-3.63.66-8.19-2.98-10.18C302.6 35.92 279.43 30 256.03 30c-77.2 0-140 62.81-140 140s62.81 140 140 140 140-62.81 140-140c0-38.46-15.34-74.35-43.18-101.04zM256.02 0c-93.74 0-170 76.26-170 170 0 57.15 28.35 107.81 71.72 138.64v77.24c0 4.14 3.36 7.5 7.5 7.5s7.5-3.36 7.5-7.5v-67.72c24.63 13.9 53.04 21.84 83.28 21.84s58.65-7.95 83.28-21.84v137.51l-83.28 41.28-83.28-41.28v-34.78c0-4.14-3.36-7.5-7.5-7.5s-7.5 3.36-7.5 7.5v35.09c0 5.55 3.09 10.52 8.06 12.99l83.79 41.53c4.03 2 8.85 1.99 12.88 0l83.78-41.53c4.97-2.47 8.06-7.44 8.06-12.99V308.65c43.37-30.84 71.72-81.49 71.72-138.64C426.03 76.26 349.77 0 256.02 0zm0 325.01c-85.47 0-155-69.53-155-155S170.56 15 256.02 15s155 69.53 155 155-69.53 155-155 155zm66.85-169.89c-1.72-5.29-6.2-9.07-11.71-9.87l-29.12-4.23-13.02-26.39c-2.46-4.99-7.44-8.08-13-8.08s-10.54 3.1-13 8.08L230 141.02l-29.12 4.23c-5.5.8-9.99 4.58-11.71 9.87s-.31 10.98 3.67 14.86l21.07 20.54-4.98 29c-.94 5.48 1.27 10.91 5.77 14.18 4.51 3.28 10.37 3.68 15.27 1.1l26.05-13.69 26.05 13.69c4.92 2.59 10.77 2.17 15.27-1.1s6.71-8.7 5.77-14.18l-4.98-29 21.07-20.54c3.98-3.88 5.39-9.58 3.67-14.86zm-60.57-37.17l-6.73 3.32 6.73-3.32zm25.17 62.02a14.478 14.478 0 00-4.17 12.83l4.85 28.26-25.38-13.34c-2.11-1.11-4.43-1.67-6.75-1.67s-4.64.56-6.75 1.67l-25.38 13.34 4.85-28.26c.81-4.7-.75-9.5-4.17-12.83l-20.53-20.02 28.38-4.12a14.51 14.51 0 0010.92-7.93l12.69-25.71 12.69 25.71a14.47 14.47 0 0010.92 7.93l28.38 4.12-20.54 20.02z"></path>
    </svg>
  );
}