import React, { memo } from 'react';

function Notes() {
  return (
    <textarea
      name=""
      id=""
      cols="30"
      rows="10"
      className="e-notes"
      placeholder="Escreva anotações aqui se quiser, mas cuidado com o teclado fazendo mto barulho"
    ></textarea>
  );
}

Notes.propTypes = {};

export default memo(Notes);
