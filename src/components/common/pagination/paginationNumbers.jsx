// Componente de paginação. Recebe as propriedades:
// { totalPages: number, currentPage: number, onPageChange: function }.
// Retorna uma barra de páginação.

import React from "react";
import _ from "lodash";

const PaginationNumbers = props => {
  const { totalPages, currentPage, onPageChange, perPage, totalItems } = props;

  const makeMiddlePages = () => {
    // Makes an array with page numbers
    const pagesArray = _.range(1, totalPages + 1);

    // Makes an array of adjacent pages from currentPage
    const before = _.slice(pagesArray, currentPage - 3, currentPage - 1);
    const after = _.slice(pagesArray, currentPage - 1, currentPage + 2);
    let middlePages = _.concat(before, after);

    // Removes first and last pages if duplicated
    middlePages = _.difference(middlePages, [1, totalPages]);

    return middlePages;
  };

  const pageSeparator = (
    <li className="page-item disabled">
      <span className="page-link">...</span>
    </li>
  );

  const getItemClass = p => {
    return currentPage === p ? "page-item active" : "page-item";
  };

  return (
    <React.Fragment>
      <ul className="pagination justify-content-center">
        {totalPages > 1 && (
          <li className={getItemClass(1)}>
            <span className="page-link" onClick={() => onPageChange(1)}>
              1
            </span>
          </li>
        )}

        {currentPage > 4 && pageSeparator}

        {makeMiddlePages().map(p => (
          <li key={p} className={getItemClass(p)}>
            <span className="page-link" onClick={() => onPageChange(p)}>
              {p}
            </span>
          </li>
        ))}

        {currentPage < totalPages - 3 && pageSeparator}

        {totalPages > 1 && (
          <li className={getItemClass(totalPages)}>
            <span
              className="page-link"
              onClick={() => onPageChange(totalPages)}
            >
              {totalPages}
            </span>
          </li>
        )}
      </ul>
      <p className="text-center">
        <small>
          <strong>
            {totalPages > 1 && "Página " + currentPage + " de " + totalPages}
          </strong>
        </small>
      </p>
    </React.Fragment>
  );
};

export default PaginationNumbers;
