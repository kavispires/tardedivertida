type BookPagesProps = {
  leftPage: any;
  rightPage: any;
};

function BookPages({ leftPage, rightPage }: BookPagesProps) {
  return (
    <svg viewBox="0 0 590 320" className="c-book-pages">
      <path
        d="M4 12.46s71.16 8 145.65 0S295 16 295 16s90.78-12.42 156 0S586 5.14 586 5.14v296s-43.23 24.6-158.29 8S295 314 295 314s-94.44-17.89-143.33-3.59c-29.88 8.74-147.64-4-147.64-4z"
        fill="#ffffff"
      ></path>
      <foreignObject x="13" y="23" width="280" height="276">
        <div>{leftPage}</div>
      </foreignObject>

      <foreignObject x="295" y="23" width="280" height="276">
        <div>{rightPage}</div>
      </foreignObject>
      <path d="M294.75 23.77h.5v280.66h-.5z" fill="grey"></path>
    </svg>
  );
}

export default BookPages;
