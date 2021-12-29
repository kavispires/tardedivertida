import PropTypes from 'prop-types';

function BookPages({ leftPage, rightPage }) {
  return (
    <svg viewBox="0 0 590 320" className="c-book-pages">
      <path
        d="M4 12.46s71.16 8 145.65 0S295 16 295 16s90.78-12.42 156 0S586 5.14 586 5.14v296s-43.23 24.6-158.29 8S295 314 295 314s-94.44-17.89-143.33-3.59c-29.88 8.74-147.64-4-147.64-4z"
        fill="#ffffff"
      ></path>
      <foreignObject x="13" y="23" width="280" height="276">
        <div xmlns="http://www.w3.org/1999/xhtml">{leftPage}</div>
      </foreignObject>

      <foreignObject x="295" y="23" width="280" height="276">
        <div xmlns="http://www.w3.org/1999/xhtml">{rightPage}</div>
      </foreignObject>
      <path d="M294.75 23.77h.5v280.66h-.5z" fill="grey"></path>
      {/* <path d="M295 23.77h281v276.67H295zm-281 0h281v276.67H14z" className="cls-3"></path> */}
    </svg>
  );
}

BookPages.propTypes = {
  leftPage: PropTypes.any,
  rightPage: PropTypes.any,
};

export default BookPages;
